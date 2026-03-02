'use client';

/**
 * AeroSphere - Main Dashboard Page
 * Composes the 3D Globe with Weather Dashboard and mode toggles.
 */
import { useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from './hooks/useWeather';
import { useWebSocket } from './hooks/useWebSocket';
import { useGlobe } from './hooks/useGlobe';
import type { CurrentWeather, AQIData } from './types/weather';

// Components
import WeatherPanel from './components/Weather/WeatherPanel';
import WeatherInsights from './components/Weather/WeatherInsights';
import HourlyForecast from './components/Weather/HourlyForecast';
import DailyForecast from './components/Weather/DailyForecast';
import RainPrediction from './components/AI/RainPrediction';
import StormAlerts from './components/Overlays/StormAlerts';
import AQIMode from './components/Overlays/AQIMode';
import MonsoonMode from './components/Overlays/MonsoonMode';
import HeatmapOverlay from './components/Overlays/HeatmapOverlay';
import ToggleSwitch from './components/UI/ToggleSwitch';
import LocationExplorer from './components/UI/LocationExplorer';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorDisplay from './components/UI/ErrorDisplay';
import GlassCard from './components/UI/GlassCard';

// Lazy load Globe (heavy Three.js component)
const GlobeView = dynamic(
  () => import('./components/Globe/GlobeView'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ width: 600, height: 600 }}>
        <LoadingSpinner size="lg" text="Loading 3D Globe..." />
      </div>
    ),
  }
);

export default function HomePage() {
  const {
    weather,
    forecast,
    aqi,
    alerts,
    rainPrediction,
    monsoon,
    loading,
    error,
    fetchWeatherData,
    fetchMonsoon,
    updateWeatherFromWS,
    clearError,
  } = useWeather();

  const {
    viewMode,
    selectedCoords,
    toggleViewMode,
    handleGlobeClick,
    onGlobeReady,
  } = useGlobe();

  // WebSocket for real-time updates
  const { connected, lastUpdate, subscribe } = useWebSocket({
    onWeatherUpdate: (data) => {
      updateWeatherFromWS(data as { weather: CurrentWeather; aqi: AQIData | null });
    },
  });

  // Handle globe click → fetch weather
  const onLocationSelect = useCallback(
    (lat: number, lng: number) => {
      handleGlobeClick(lat, lng);
      fetchWeatherData(lat, lng);
      subscribe(lat, lng);
    },
    [handleGlobeClick, fetchWeatherData, subscribe]
  );

  // Fetch monsoon data when monsoon mode is activated
  useEffect(() => {
    if (viewMode === 'monsoon') {
      fetchMonsoon();
    }
  }, [viewMode, fetchMonsoon]);

  return (
    <main className="relative min-h-screen grid-pattern">
      {/* Header */}
      <motion.header
        className="relative z-20 flex items-center justify-between px-8 py-5 glass-strong"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-sky-400 to-amber-400 flex items-center justify-center text-slate-900 font-bold text-lg shadow-lg shadow-teal-500/25"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            🌍
          </motion.div>
          <div>
            <h1 className="text-xl font-bold gradient-text">AeroSphere</h1>
            <p className="text-xs text-slate-400">Global Weather Intelligence • Search, Save, Explore</p>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 pulse-glow' : 'bg-gray-600'
                }`}
            />
            <span className="text-xs text-gray-400">
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>

          {/* Last update */}
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Updated {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>
      </motion.header>

      {/* Mode Toggles Bar */}
      <motion.div
        className="relative z-20 flex items-center gap-3 px-8 py-3 overflow-x-auto scrollbar-thin"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ToggleSwitch
          label="Heatmap"
          icon="🌡️"
          active={viewMode === 'heatmap'}
          onToggle={() => toggleViewMode('heatmap')}
          activeColor="bg-amber-500"
        />
        <ToggleSwitch
          label="Storm Alerts"
          icon="⚡"
          active={viewMode === 'storm'}
          onToggle={() => toggleViewMode('storm')}
          activeColor="bg-rose-500"
        />
        <ToggleSwitch
          label="Air Quality"
          icon="🌿"
          active={viewMode === 'aqi'}
          onToggle={() => toggleViewMode('aqi')}
          activeColor="bg-emerald-500"
        />
        <ToggleSwitch
          label="Monsoon Mode"
          icon="🌧️"
          active={viewMode === 'monsoon'}
          onToggle={() => toggleViewMode('monsoon')}
          activeColor="bg-sky-500"
        />
      </motion.div>

      <LocationExplorer
        onSelectLocation={(lat, lon) => onLocationSelect(lat, lon)}
        currentLabel={weather ? `${weather.location}, ${weather.country}` : null}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-0 px-4 lg:px-8 pb-8">
        {/* Left: Globe */}
        <motion.div
          className="flex-shrink-0 flex flex-col items-center globe-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-start justify-center lg:sticky lg:top-4">
            <Suspense
              fallback={
                <div className="flex items-center justify-center" style={{ width: 600, height: 600 }}>
                  <LoadingSpinner size="lg" text="Loading 3D Globe..." />
                </div>
              }
            >
              <GlobeView
                viewMode={viewMode}
                onGlobeClick={onLocationSelect}
                onGlobeReady={onGlobeReady}
                monsoonCities={monsoon?.cities}
                selectedCoords={selectedCoords}
              />
            </Suspense>
          </div>
        </motion.div>

        {/* Right: Weather Dashboard */}
        <div className="flex-1 min-w-0 space-y-4 lg:max-w-lg xl:max-w-xl">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {loading && (
              <motion.div
                key="loading"
                className="flex items-center justify-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSpinner size="lg" text="Fetching weather data..." />
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-6">
                  <ErrorDisplay
                    message={error}
                    onRetry={() => {
                      clearError();
                      if (selectedCoords) {
                        fetchWeatherData(selectedCoords.lat, selectedCoords.lon);
                      }
                    }}
                  />
                </GlassCard>
              </motion.div>
            )}

            {/* No selection prompt */}
            {!weather && !loading && !error && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="p-8 text-center">
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🌍
                  </motion.div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Select a Location
                  </h2>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Click anywhere on the 3D globe to fetch real-time weather data for that location.
                    Rotate and zoom to explore the world.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <QuickLocationButton
                      label="🇮🇳 Delhi"
                      onClick={() => onLocationSelect(28.61, 77.21)}
                    />
                    <QuickLocationButton
                      label="🇺🇸 New York"
                      onClick={() => onLocationSelect(40.71, -74.01)}
                    />
                    <QuickLocationButton
                      label="🇬🇧 London"
                      onClick={() => onLocationSelect(51.51, -0.13)}
                    />
                    <QuickLocationButton
                      label="🇯🇵 Tokyo"
                      onClick={() => onLocationSelect(35.68, 139.69)}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Weather Data */}
            {weather && !loading && (
              <motion.div
                key="weather"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WeatherInsights weather={weather} />

                {/* Main Weather Panel */}
                <WeatherPanel weather={weather} aqi={aqi} />

                {/* Hourly Forecast */}
                {forecast?.hourly && <HourlyForecast hourly={forecast.hourly} />}

                {/* Daily Forecast */}
                {forecast?.daily && <DailyForecast daily={forecast.daily} />}

                {/* AI Rain Prediction */}
                {rainPrediction && <RainPrediction prediction={rainPrediction} />}

                {/* Conditional Overlay Panels */}
                {viewMode === 'heatmap' && <HeatmapOverlay />}
                {viewMode === 'storm' && alerts && <StormAlerts alerts={alerts} />}
                {viewMode === 'aqi' && aqi && <AQIMode aqi={aqi} />}
                {viewMode === 'monsoon' && monsoon && <MonsoonMode monsoon={monsoon} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="relative z-20 text-center py-6 text-xs text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          AeroSphere — Powered by OpenWeatherMap • Built with Next.js, Three.js & Express
        </p>
        <motion.div
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-teal-500/10 px-4 py-1.5 shadow-lg shadow-teal-500/15"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.18em] text-teal-200 font-mono">Certified Creator</span>
          <span className="text-xs font-semibold text-amber-100">Himanshu Kaushik</span>
        </motion.div>
      </motion.footer>
    </main>
  );
}

// Quick location selection button
function QuickLocationButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-gray-300 hover:bg-white/[0.1] hover:border-teal-400/35 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
}
