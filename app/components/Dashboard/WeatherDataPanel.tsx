'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { CurrentWeather, AQIData } from '../../types/weather';
import { capitalize, windDirection, getAQILevel, getWeatherIconUrl } from '../../utils/helpers';

interface WeatherDataPanelProps {
    weather: CurrentWeather | null;
    aqi: AQIData | null;
    loading: boolean;
    error: string | null;
    onRetry?: () => void;
}

export default function WeatherDataPanel({ weather, aqi, loading, error, onRetry }: WeatherDataPanelProps) {
    return (
        <AnimatePresence mode="wait">
            {loading && (
                <motion.div
                    key="loading"
                    className="widget-card p-8 flex items-center justify-center min-h-[240px]"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                >
                    <div className="text-center">
                        <motion.div
                            className="w-14 h-14 rounded-full border-2 border-accent-primary/30 border-t-accent-primary mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <p className="text-sm text-text-secondary font-mono">Fetching weather data<span className="animate-data-pulse">...</span></p>
                        <p className="text-xs text-text-muted mt-1">Connecting to satellite</p>
                    </div>
                </motion.div>
            )}

            {error && !loading && (
                <motion.div
                    key="error"
                    className="widget-card p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <div className="text-center">
                        <div className="text-3xl mb-4">⚠️</div>
                        <p className="text-base text-red-400 mb-4 font-medium">{error}</p>
                        {onRetry && (
                            <motion.button
                                onClick={onRetry}
                                className="px-6 py-2 rounded-xl bg-accent-primary/10 border border-accent-primary/25 text-sm text-accent-primary hover:bg-accent-primary/20 transition-all interactive-btn font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ↻ Retry Connection
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}

            {weather && !loading && (
                <motion.div
                    key="weather"
                    className="widget-card p-6 lg:p-7"
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <h3 className="text-xl font-display font-bold text-text-primary leading-tight">{weather.location}</h3>
                            <p className="text-sm text-text-muted mt-0.5">{weather.country}</p>
                            <p className="text-[11px] text-text-muted/60 font-mono mt-0.5">
                                {weather.coordinates.lat.toFixed(2)}°N, {weather.coordinates.lon.toFixed(2)}°E
                            </p>
                        </div>
                        <motion.div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/[0.08] border border-green-500/20"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] text-green-400 font-mono uppercase font-bold">Live</span>
                        </motion.div>
                    </div>

                    {/* Temperature + Icon */}
                    <div className="flex items-center gap-5 mb-6">
                        <div>
                            <motion.div
                                className="text-5xl lg:text-6xl font-display font-bold text-text-primary leading-none"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', bounce: 0.3, duration: 0.8 }}
                            >
                                {Math.round(weather.temperature)}°
                            </motion.div>
                            <p className="text-sm text-text-muted mt-1.5">
                                Feels like <span className="text-text-secondary font-medium">{Math.round(weather.feelsLike)}°</span>
                            </p>
                        </div>
                        <motion.div
                            className="flex-shrink-0"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getWeatherIconUrl(weather.icon, '4x')}
                                alt={weather.description}
                                width={80}
                                height={80}
                                className="drop-shadow-xl"
                            />
                        </motion.div>
                    </div>

                    {/* Condition badge */}
                    <motion.div
                        className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6 inline-flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                        <span className="text-sm text-text-secondary font-medium">{capitalize(weather.description)}</span>
                    </motion.div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatItem label="Humidity" value={`${weather.humidity}%`} icon="💧" delay={0.1} />
                        <StatItem label="Wind" value={`${weather.windSpeed} m/s`} extra={windDirection(weather.windDeg)} icon="💨" delay={0.15} />
                        <StatItem label="Pressure" value={`${weather.pressure} hPa`} icon="📊" delay={0.2} />
                        <StatItem label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} icon="👁️" delay={0.25} />
                        <StatItem label="Clouds" value={`${weather.clouds}%`} icon="☁️" delay={0.3} />
                        <StatItem label="Min / Max" value={`${Math.round(weather.tempMin)}° / ${Math.round(weather.tempMax)}°`} icon="🌡️" delay={0.35} />
                    </div>

                    {/* AQI */}
                    {aqi && (
                        <motion.div
                            className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-text-muted font-mono uppercase tracking-wider">Air Quality Index</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getAQILevel(aqi.aqi).emoji}</span>
                                    <span className="text-sm font-display font-bold" style={{ color: getAQILevel(aqi.aqi).color }}>
                                        {getAQILevel(aqi.aqi).label}
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: getAQILevel(aqi.aqi).color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(aqi.aqi / 5) * 100}%` }}
                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                                />
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function StatItem({ label, value, extra, icon, delay = 0 }: { label: string; value: string; extra?: string; icon: string; delay?: number }) {
    return (
        <motion.div
            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all cursor-default group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center gap-2 mb-1">
                <span className="text-sm group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">{label}</span>
            </div>
            <p className="text-[15px] font-display font-semibold text-text-primary">{value}</p>
            {extra && <p className="text-[10px] text-text-muted mt-0.5">{extra}</p>}
        </motion.div>
    );
}
