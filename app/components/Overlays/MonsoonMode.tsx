'use client';

/**
 * MonsoonMode - India monsoon tracking panel.
 * Shows rainfall and weather data for key Indian cities.
 */
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import type { MonsoonData } from '../../types/weather';

interface MonsoonModeProps {
    monsoon: MonsoonData;
}

export default function MonsoonMode({ monsoon }: MonsoonModeProps) {
    const getRainfallColor = (rainfall: number) => {
        if (rainfall > 50) return '#ef4444';
        if (rainfall > 20) return '#f97316';
        if (rainfall > 5) return '#3b82f6';
        if (rainfall > 0) return '#06b6d4';
        return '#6b7280';
    };

    return (
        <GlassCard className="p-5" delay={0.3}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-lg">🌧️</span>
                India Monsoon Tracker
                <motion.span
                    className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    LIVE
                </motion.span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {monsoon.cities.map((city, idx) => (
                    <motion.div
                        key={city.name}
                        className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05] hover:bg-white/[0.06] transition-colors"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * idx }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-white">{city.name}</h4>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://openweathermap.org/img/wn/${city.icon}.png`}
                                alt={city.condition}
                                className="w-8 h-8"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Temp</span>
                                <span className="text-white font-medium">{city.temp}°C</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Humidity</span>
                                <span className="text-blue-400 font-medium">{city.humidity}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Rainfall</span>
                                <span className="font-medium" style={{ color: getRainfallColor(city.rainfall) }}>
                                    {city.rainfall > 0 ? `${city.rainfall.toFixed(1)} mm` : '—'}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Wind</span>
                                <span className="text-teal-400 font-medium">{city.windSpeed.toFixed(1)} m/s</span>
                            </div>
                        </div>

                        {/* Humidity bar */}
                        <div className="mt-2 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${city.humidity}%` }}
                                transition={{ duration: 0.8, delay: 0.1 * idx }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
}
