'use client';

/**
 * DailyForecast - 10-day forecast in card grid layout.
 */
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import type { DailyForecastItem } from '../../types/weather';
import { formatDay, formatDate } from '../../utils/helpers';

interface DailyForecastProps {
    daily: DailyForecastItem[];
}

export default function DailyForecast({ daily }: DailyForecastProps) {
    return (
        <GlassCard className="p-5" delay={0.3}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Extended Forecast
            </h3>

            <div className="grid grid-cols-1 gap-2">
                {daily.map((item, idx) => (
                    <motion.div
                        key={item.dt}
                        className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.05] hover:bg-white/[0.06] transition-colors group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.3 }}
                    >
                        {/* Day */}
                        <div className="w-24">
                            <p className="text-sm font-semibold text-white">
                                {idx === 0 ? 'Today' : formatDay(item.dt)}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(item.dt)}</p>
                        </div>

                        {/* Icon + Condition */}
                        <div className="flex items-center gap-2 w-32">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                                alt={item.condition}
                                className="w-8 h-8"
                            />
                            <span className="text-xs text-gray-400 truncate">{item.condition}</span>
                        </div>

                        {/* Rain probability */}
                        <div className="w-16 text-right">
                            {item.pop > 0 && (
                                <span className="text-xs text-blue-400">💧 {item.pop}%</span>
                            )}
                        </div>

                        {/* Temperature range */}
                        <div className="flex items-center gap-3 w-24 justify-end">
                            <span className="text-sm font-medium text-white">{item.tempMax}°</span>
                            <div className="w-16 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background: `linear-gradient(to right, #3b82f6, #f59e0b)`,
                                        width: `${Math.min(100, ((item.tempMax - item.tempMin) / 40) * 100 + 30)}%`,
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, ((item.tempMax - item.tempMin) / 40) * 100 + 30)}%` }}
                                    transition={{ duration: 0.8, delay: 0.1 * idx }}
                                />
                            </div>
                            <span className="text-sm text-gray-500">{item.tempMin}°</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
}
