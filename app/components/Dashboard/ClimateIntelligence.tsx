'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { AQIData, RainPrediction, AlertsData } from '../../types/weather';
import { getAQILevel } from '../../utils/helpers';

interface ClimateIntelligenceProps {
    aqi: AQIData | null;
    rainPrediction: RainPrediction | null;
    alerts: AlertsData | null;
}

export default function ClimateIntelligence({ aqi, rainPrediction, alerts }: ClimateIntelligenceProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="climate" className="section-padding relative" ref={ref}>
            <div className="max-w-[1800px] mx-auto">
                {/* Section header */}
                <motion.div
                    className="flex items-center gap-4 mb-10"
                    initial={{ opacity: 0, y: 25 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-accent-primary to-transparent" />
                    <div>
                        <h2 className="section-header font-display font-bold text-text-primary">
                            Climate <span className="gradient-text-accent">Intelligence</span>
                        </h2>
                        <p className="text-sm text-text-muted mt-1">
                            AI-powered analytics and real-time monitoring
                        </p>
                    </div>
                </motion.div>

                {/* Widget grid */}
                <div className="dashboard-grid">
                    {/* 1: Temperature Anomaly */}
                    <motion.div
                        className="widget-card p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm text-text-muted font-mono uppercase tracking-widest">Global Temp Anomaly</h3>
                            <span className="text-2xl">🌡️</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                            <motion.span
                                className="text-4xl font-display font-bold text-text-primary"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ type: 'spring', bounce: 0.3, delay: 0.3 }}
                            >
                                +1.2
                            </motion.span>
                            <span className="text-xl text-accent-primary font-display font-bold">°C</span>
                        </div>
                        <p className="text-sm text-text-muted mb-5">Above 20th century average</p>

                        {/* Animated bar chart */}
                        <div className="flex items-end gap-1.5 h-16">
                            {[0.6, 0.7, 0.8, 0.75, 0.9, 1.0, 0.95, 1.1, 1.05, 1.15, 1.2, 1.18].map((v, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 rounded-t-sm"
                                    style={{
                                        background: `linear-gradient(to top, rgba(179,12,11,0.3), rgba(179,12,11,${0.4 + v * 0.4}))`,
                                    }}
                                    initial={{ height: 0 }}
                                    animate={isInView ? { height: `${(v / 1.3) * 100}%` } : {}}
                                    transition={{ delay: 0.05 * i + 0.4, duration: 0.5, ease: 'easeOut' }}
                                    whileHover={{ opacity: 0.8 }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-text-muted font-mono">Jan</span>
                            <span className="text-[10px] text-text-muted font-mono">Jun</span>
                            <span className="text-[10px] text-text-muted font-mono">Dec</span>
                        </div>
                    </motion.div>

                    {/* 2: Rain AI */}
                    <motion.div
                        className="widget-card p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm text-text-muted font-mono uppercase tracking-widest">Rain Prediction AI</h3>
                            <span className="text-2xl">🤖</span>
                        </div>
                        {rainPrediction ? (
                            <>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <motion.span
                                        className="text-4xl font-display font-bold text-text-primary"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ type: 'spring', bounce: 0.3, delay: 0.4 }}
                                    >
                                        {rainPrediction.probability}
                                    </motion.span>
                                    <span className="text-xl text-accent-primary font-display font-bold">%</span>
                                </div>
                                <p className="text-sm text-text-muted mb-5">
                                    {rainPrediction.intensity} • {rainPrediction.confidence}
                                </p>

                                {/* Circular gauge */}
                                <div className="relative w-28 h-28 mx-auto">
                                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3"
                                        />
                                        <motion.path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none" stroke="url(#rainGradient)" strokeWidth="3" strokeLinecap="round"
                                            initial={{ strokeDasharray: '0, 100' }}
                                            animate={isInView ? { strokeDasharray: `${rainPrediction.probability}, 100` } : {}}
                                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                                        />
                                        <defs>
                                            <linearGradient id="rainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#B30C0B" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-lg font-display font-bold text-text-primary">{rainPrediction.probability}%</span>
                                        <span className="text-[9px] text-text-muted/60 font-mono">probability</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-text-muted text-center mt-3 font-mono bg-white/[0.02] mx-auto px-3 py-1 rounded-full inline-block w-auto">
                                    Model: {rainPrediction.model}
                                </p>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <motion.div
                                    className="text-4xl mb-3"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    🤖
                                </motion.div>
                                <p className="text-sm text-text-muted">Select a location to activate</p>
                                <p className="text-xs text-text-muted/60 mt-1">AI rain prediction engine</p>
                            </div>
                        )}
                    </motion.div>

                    {/* 3: Storm Tracking */}
                    <motion.div
                        className="widget-card p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm text-text-muted font-mono uppercase tracking-widest">Storm Tracker</h3>
                            <span className="text-2xl">⚡</span>
                        </div>
                        {alerts && alerts.hasAlerts ? (
                            <>
                                <motion.div
                                    className="text-4xl font-display font-bold text-red-400 mb-1"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {alerts.alerts.length}
                                </motion.div>
                                <p className="text-sm text-text-muted mb-5">Active weather alerts</p>
                                <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                                    {alerts.alerts.map((alert, i) => (
                                        <motion.div
                                            key={i}
                                            className="p-3 rounded-xl bg-red-500/[0.05] border border-red-500/10"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <motion.span
                                                    className={`w-2 h-2 rounded-full flex-shrink-0 ${alert.severity === 'extreme' ? 'bg-red-500' : 'bg-orange-500'}`}
                                                    animate={{ opacity: [1, 0.3, 1] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                                <span className="text-sm font-medium text-text-primary truncate">{alert.title}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Radar animation */}
                                <div className="relative w-28 h-28 mx-auto mb-4">
                                    <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
                                    <div className="absolute inset-4 rounded-full border border-white/[0.05]" />
                                    <div className="absolute inset-8 rounded-full border border-white/[0.04]" />
                                    <div className="absolute inset-0 rounded-full overflow-hidden">
                                        <motion.div
                                            className="w-1/2 h-full origin-right"
                                            style={{ background: 'conic-gradient(from 0deg, transparent, rgba(34,197,94,0.15))' }}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            className="w-3 h-3 rounded-full bg-green-500"
                                            style={{ boxShadow: '0 0 10px rgba(34,197,94,0.6)' }}
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                </div>
                                <p className="text-base text-green-400 text-center font-display font-bold">All Clear</p>
                                <p className="text-xs text-text-muted text-center mt-1">No active storm warnings</p>
                            </>
                        )}
                    </motion.div>

                    {/* 4: Air Quality */}
                    <motion.div
                        className="widget-card p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm text-text-muted font-mono uppercase tracking-widest">Air Quality</h3>
                            <span className="text-2xl">🌿</span>
                        </div>
                        {aqi ? (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <motion.span
                                        className="text-3xl"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        {getAQILevel(aqi.aqi).emoji}
                                    </motion.span>
                                    <div>
                                        <span className="text-3xl font-display font-bold text-text-primary">{aqi.aqi}</span>
                                        <span className="text-base font-display font-bold ml-2" style={{ color: getAQILevel(aqi.aqi).color }}>
                                            {getAQILevel(aqi.aqi).label}
                                        </span>
                                    </div>
                                </div>

                                {/* Pollutant bars */}
                                <div className="space-y-3 mt-5">
                                    {[
                                        { label: 'PM2.5', value: aqi.components.pm2_5, max: 75, color: '#ef4444' },
                                        { label: 'PM10', value: aqi.components.pm10, max: 150, color: '#f59e0b' },
                                        { label: 'O₃', value: aqi.components.o3, max: 200, color: '#22c55e' },
                                        { label: 'NO₂', value: aqi.components.no2, max: 200, color: '#3b82f6' },
                                    ].map((p, i) => (
                                        <div key={p.label}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] text-text-muted font-mono">{p.label}</span>
                                                <span className="text-[11px] text-text-secondary font-mono font-bold">{p.value.toFixed(1)} µg/m³</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: p.color }}
                                                    initial={{ width: 0 }}
                                                    animate={isInView ? { width: `${Math.min((p.value / p.max) * 100, 100)}%` } : {}}
                                                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 + 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <motion.div
                                    className="text-4xl mb-3"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    🌿
                                </motion.div>
                                <p className="text-sm text-text-muted">Select a location to view</p>
                                <p className="text-xs text-text-muted/60 mt-1">Air quality monitoring data</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
