'use client';

/**
 * WeatherPanel - Main glassmorphism weather info panel.
 * Shows current temperature, feels like, humidity, wind, AQI, and weather icon.
 */
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import WeatherIcon from './WeatherIcon';
import type { CurrentWeather, AQIData } from '../../types/weather';
import { capitalize, windDirection, getAQILevel } from '../../utils/helpers';

interface WeatherPanelProps {
    weather: CurrentWeather;
    aqi: AQIData | null;
}

export default function WeatherPanel({ weather, aqi }: WeatherPanelProps) {
    const aqiLevel = aqi ? getAQILevel(aqi.aqi) : null;

    return (
        <GlassCard className="p-6" delay={0.1}>
            {/* Location Header */}
            <motion.div
                className="flex items-start justify-between mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {weather.location}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {weather.country} • {weather.coordinates.lat.toFixed(2)}°,{' '}
                        {weather.coordinates.lon.toFixed(2)}°
                    </p>
                </div>
                <WeatherIcon icon={weather.icon} condition={weather.condition} size={80} />
            </motion.div>

            {/* Temperature */}
            <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-end gap-3">
                    <span className="text-6xl font-extralight text-white tracking-tight">
                        {weather.temperature}°
                    </span>
                    <div className="pb-2">
                        <p className="text-sm text-gray-400">
                            Feels like <span className="text-white font-medium">{weather.feelsLike}°C</span>
                        </p>
                        <p className="text-sm text-cyan-400 capitalize mt-0.5">
                            {capitalize(weather.description)}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>H: {weather.tempMax}°</span>
                    <span>L: {weather.tempMin}°</span>
                </div>
            </motion.div>

            {/* Weather Details Grid */}
            <motion.div
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {/* Humidity */}
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-blue-400">💧</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Humidity</span>
                    </div>
                    <p className="text-xl font-semibold text-white">{weather.humidity}%</p>
                    <div className="mt-1.5 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${weather.humidity}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>
                </div>

                {/* Wind */}
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-teal-400">🌬️</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Wind</span>
                    </div>
                    <p className="text-xl font-semibold text-white">
                        {weather.windSpeed.toFixed(1)}{' '}
                        <span className="text-sm text-gray-400">m/s</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {windDirection(weather.windDeg)} ({weather.windDeg}°)
                    </p>
                </div>

                {/* Pressure */}
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-purple-400">🔵</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Pressure</span>
                    </div>
                    <p className="text-xl font-semibold text-white">
                        {weather.pressure}{' '}
                        <span className="text-sm text-gray-400">hPa</span>
                    </p>
                </div>

                {/* AQI */}
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span>{aqiLevel?.emoji || '🌿'}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">AQI</span>
                    </div>
                    {aqi ? (
                        <>
                            <p className="text-xl font-semibold" style={{ color: aqiLevel?.color }}>
                                {aqi.aqi}/5
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: aqiLevel?.color }}>
                                {aqiLevel?.label}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">N/A</p>
                    )}
                </div>

                {/* Visibility */}
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-yellow-400">👁️</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Visibility</span>
                    </div>
                    <p className="text-xl font-semibold text-white">
                        {(weather.visibility / 1000).toFixed(1)}{' '}
                        <span className="text-sm text-gray-400">km</span>
                    </p>
                </div>

                {/* Clouds */}
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-gray-400">☁️</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Clouds</span>
                    </div>
                    <p className="text-xl font-semibold text-white">{weather.clouds}%</p>
                    <div className="mt-1.5 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-gray-400 to-slate-300 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${weather.clouds}%` }}
                            transition={{ duration: 1, delay: 0.6 }}
                        />
                    </div>
                </div>
            </motion.div>
        </GlassCard>
    );
}
