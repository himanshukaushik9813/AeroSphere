'use client';

/**
 * HourlyForecast - Horizontal scrollable 24-hour forecast cards.
 */
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import type { HourlyForecastItem } from '../../types/weather';
import { formatTime } from '../../utils/helpers';

interface HourlyForecastProps {
    hourly: HourlyForecastItem[];
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
    return (
        <GlassCard className="p-5" delay={0.2}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hourly Forecast
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {hourly.map((item, idx) => (
                    <motion.div
                        key={item.dt}
                        className="flex-shrink-0 flex flex-col items-center gap-2 bg-white/[0.03] rounded-xl p-3 min-w-[80px] border border-white/[0.05] hover:bg-white/[0.06] transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx, duration: 0.3 }}
                    >
                        <span className="text-xs text-gray-400 font-medium">
                            {idx === 0 ? 'Now' : formatTime(item.dt)}
                        </span>

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                            alt={item.condition}
                            className="w-8 h-8"
                        />

                        <span className="text-base font-semibold text-white">{item.temp}°</span>

                        {/* Rain probability */}
                        {item.pop > 0 && (
                            <span className="text-xs text-blue-400">
                                💧 {Math.round(item.pop * 100)}%
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
}
