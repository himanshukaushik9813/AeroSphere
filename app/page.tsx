'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from './hooks/useWeather';
import { useWebSocket } from './hooks/useWebSocket';
import { useGlobe } from './hooks/useGlobe';
import type { CurrentWeather, AQIData } from './types/weather';

// Dashboard components
import DashboardNavbar from './components/Dashboard/DashboardNavbar';
import GlobeSection from './components/Dashboard/GlobeSection';
import WeatherDataPanel from './components/Dashboard/WeatherDataPanel';
import ForecastPanel from './components/Dashboard/ForecastPanel';
import HeatmapControls from './components/Dashboard/HeatmapControls';
import ClimateIntelligence from './components/Dashboard/ClimateIntelligence';
import NotificationSystem from './components/Dashboard/NotificationSystem';
import DashboardFooter from './components/Dashboard/DashboardFooter';

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

  // Geolocation state
  const [locating, setLocating] = useState(false);

  // Handle globe click → fetch weather
  const onLocationSelect = useCallback(
    (lat: number, lng: number) => {
      handleGlobeClick(lat, lng);
      fetchWeatherData(lat, lng);
      subscribe(lat, lng);
    },
    [handleGlobeClick, fetchWeatherData, subscribe]
  );

  // Handle "My Location" — browser Geolocation API
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect(latitude, longitude);
        setLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Unable to get your location. Please allow location access and try again.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [onLocationSelect]);

  // Fetch monsoon data when monsoon mode is activated
  useEffect(() => {
    if (viewMode === 'monsoon') {
      fetchMonsoon();
    }
  }, [viewMode, fetchMonsoon]);

  return (
    <main id="dashboard" className="relative min-h-screen bg-bg-primary">
      {/* Navbar */}
      <DashboardNavbar connected={connected} lastUpdate={lastUpdate} onLocateMe={handleLocateMe} locating={locating} />

      {/* Notifications */}
      <NotificationSystem alerts={alerts} />

      {/* Globe + Weather Panel */}
      <div className="relative">
        <GlobeSection
          viewMode={viewMode}
          onGlobeClick={onLocationSelect}
          onGlobeReady={onGlobeReady}
          monsoonCities={monsoon?.cities}
          selectedCoords={selectedCoords}
          hasWeatherData={!!weather}
        />

        {/* Heatmap controls */}
        <div className="relative z-20 -mt-10 sm:-mt-8 lg:-mt-12 mb-6">
          <HeatmapControls viewMode={viewMode} onToggle={toggleViewMode} />
        </div>

        {/* Weather data panel */}
        <motion.div
          className="relative z-20 mx-4 sm:mx-6 lg:absolute lg:top-24 lg:right-8 lg:mx-0 lg:w-[340px] max-w-[calc(100vw-2rem)] lg:max-w-none"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WeatherDataPanel
            weather={weather}
            aqi={aqi}
            loading={loading}
            error={error}
            onRetry={() => {
              clearError();
              if (selectedCoords) {
                fetchWeatherData(selectedCoords.lat, selectedCoords.lon);
              }
            }}
          />
        </motion.div>
      </div>

      {/* Forecast */}
      <ForecastPanel forecast={forecast} />

      {/* Climate Intelligence */}
      <ClimateIntelligence
        aqi={aqi}
        rainPrediction={rainPrediction}
        alerts={alerts}
      />

      {/* Footer */}
      <DashboardFooter connected={connected} />
    </main>
  );
}
