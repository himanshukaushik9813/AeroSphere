'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { ForecastData } from '../../types/weather';
import { formatTime, formatDay, getWeatherIconUrl } from '../../utils/helpers';

interface ForecastPanelProps {
    forecast: ForecastData | null;
}

export default function ForecastPanel({ forecast }: ForecastPanelProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    if (!forecast) return null;

    return (
        <section id="forecast" className="section-padding relative" ref={ref}>
            <div className="max-w-[1800px] mx-auto">
                {/* Section header */}
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: 25 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-accent-primary to-transparent" />
                    <div>
                        <h2 className="section-header font-display font-bold text-text-primary">
                            Weather <span className="gradient-text-accent">Forecast</span>
                        </h2>
                        <p className="text-sm text-text-muted mt-1">
                            {forecast.city.name}, {forecast.city.country} — Next 10 days
                        </p>
                    </div>
                </motion.div>

                {/* 24-hour forecast */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 25 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.7 }}
                >
                    <h3 className="text-sm text-text-muted font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-accent-primary/50" />
                        24-Hour Timeline
                    </h3>
                    <div className="flex gap-2.5 overflow-x-auto scrollbar-thin pb-3 -mx-2 px-2">
                        {forecast.hourly.slice(0, 24).map((hour, i) => (
                            <motion.div
                                key={hour.dt}
                                className={`flex-shrink-0 widget-card p-4 min-w-[90px] text-center cursor-default ${i === 0 ? 'border-accent-primary/20 bg-accent-primary/[0.04]' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.025 * i + 0.2 }}
                                whileHover={{ y: -4, scale: 1.03 }}
                            >
                                <p className={`text-[11px] font-mono mb-2 ${i === 0 ? 'text-accent-primary font-bold' : 'text-text-muted'}`}>
                                    {i === 0 ? 'NOW' : formatTime(hour.dt)}
                                </p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={getWeatherIconUrl(hour.icon)}
                                    alt={hour.condition}
                                    width={40}
                                    height={40}
                                    className="mx-auto"
                                />
                                <p className="text-base font-display font-bold text-text-primary mt-1">
                                    {Math.round(hour.temp)}°
                                </p>
                                {hour.pop > 0 && (
                                    <div className="mt-1.5 flex items-center justify-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                                        <p className="text-[10px] text-blue-400 font-mono">
                                            {Math.round(hour.pop * 100)}%
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 10-day forecast */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.7 }}
                >
                    <h3 className="text-sm text-text-muted font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-accent-primary/50" />
                        Extended Forecast
                    </h3>
                    <div className="widget-card divide-y divide-white/[0.04] overflow-hidden">
                        {forecast.daily.map((day, i) => {
                            const tempRange = 60;
                            const minPos = Math.max(0, ((day.tempMin + 10) / tempRange) * 100);
                            const maxPos = Math.min(100, ((day.tempMax + 10) / tempRange) * 100);

                            return (
                                <motion.div
                                    key={day.dt}
                                    className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-all group cursor-default"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.04 * i + 0.4 }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="flex items-center gap-4 min-w-[130px]">
                                        <span className={`text-base font-display font-medium w-14 ${i === 0 ? 'text-accent-primary' : 'text-text-secondary'}`}>
                                            {i === 0 ? 'Today' : formatDay(day.dt)}
                                        </span>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={getWeatherIconUrl(day.icon)}
                                            alt={day.condition}
                                            width={32}
                                            height={32}
                                            className="group-hover:scale-110 transition-transform"
                                        />
                                        <span className="text-xs text-text-muted capitalize hidden sm:inline">{day.condition}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs">
                                        {day.pop > 0 && (
                                            <span className="text-blue-400 mr-3 font-mono">💧 {Math.round(day.pop * 100)}%</span>
                                        )}
                                    </div>

                                    {/* Temperature bar */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-text-muted w-10 text-right font-mono">{Math.round(day.tempMin)}°</span>
                                        <div className="w-28 h-2 rounded-full bg-white/[0.05] relative overflow-hidden">
                                            <motion.div
                                                className="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue-500 via-accent-primary/70 to-accent-primary"
                                                initial={{ left: '50%', right: '50%' }}
                                                animate={isInView ? { left: `${minPos}%`, right: `${100 - maxPos}%` } : {}}
                                                transition={{ duration: 0.8, delay: 0.04 * i + 0.5, ease: 'easeOut' }}
                                            />
                                        </div>
                                        <span className="text-sm text-text-primary font-display font-bold w-10">{Math.round(day.tempMax)}°</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
