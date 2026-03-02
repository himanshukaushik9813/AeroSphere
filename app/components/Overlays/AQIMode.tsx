'use client';

/**
 * AQIMode - Air quality index detailed panel.
 */
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import type { AQIData } from '../../types/weather';
import { getAQILevel } from '../../utils/helpers';

interface AQIModeProps {
    aqi: AQIData;
}

export default function AQIMode({ aqi }: AQIModeProps) {
    const level = getAQILevel(aqi.aqi);

    const pollutants = [
        { name: 'PM2.5', value: aqi.components.pm2_5, unit: 'μg/m³', max: 75 },
        { name: 'PM10', value: aqi.components.pm10, unit: 'μg/m³', max: 150 },
        { name: 'O₃', value: aqi.components.o3, unit: 'μg/m³', max: 180 },
        { name: 'NO₂', value: aqi.components.no2, unit: 'μg/m³', max: 200 },
        { name: 'SO₂', value: aqi.components.so2, unit: 'μg/m³', max: 350 },
        { name: 'CO', value: aqi.components.co, unit: 'μg/m³', max: 15000 },
    ];

    return (
        <GlassCard className="p-5" delay={0.35}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-lg">🌿</span>
                Air Quality Index
            </h3>

            {/* AQI Score */}
            <div className="flex items-center gap-4 mb-5">
                <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: `${level.color}20`, color: level.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                >
                    {aqi.aqi}
                </motion.div>
                <div>
                    <p className="text-lg font-semibold" style={{ color: level.color }}>
                        {level.label}
                    </p>
                    <p className="text-xs text-gray-500">
                        Air Quality Index (1-5 scale)
                    </p>
                </div>
            </div>

            {/* AQI Scale */}
            <div className="mb-5">
                <div className="flex h-2 rounded-full overflow-hidden">
                    {['#4ade80', '#a3e635', '#facc15', '#f97316', '#ef4444'].map((color, i) => (
                        <div
                            key={i}
                            className="flex-1 relative"
                            style={{ backgroundColor: color }}
                        >
                            {aqi.aqi === i + 1 && (
                                <motion.div
                                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                                    style={{ backgroundColor: color }}
                                    layoutId="aqi-indicator"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-500">Good</span>
                    <span className="text-[10px] text-gray-500">Very Poor</span>
                </div>
            </div>

            {/* Pollutant details */}
            <div className="space-y-2.5">
                {pollutants.map((p, idx) => (
                    <motion.div
                        key={p.name}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                    >
                        <span className="text-xs text-gray-400 w-12 font-mono">{p.name}</span>
                        <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: `linear-gradient(to right, #22c55e, #facc15, #ef4444)`,
                                    width: `${Math.min(100, (p.value / p.max) * 100)}%`,
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (p.value / p.max) * 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.1 * idx }}
                            />
                        </div>
                        <span className="text-xs text-gray-400 w-20 text-right font-mono">
                            {p.value.toFixed(1)} <span className="text-gray-600">{p.unit}</span>
                        </span>
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
}
