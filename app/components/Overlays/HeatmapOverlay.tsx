'use client';

/**
 * HeatmapOverlay - Temperature heatmap legend and info panel.
 */
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';

export default function HeatmapOverlay() {
    const gradientStops = [
        { temp: -20, color: '#1e3a5f', label: '-20°C' },
        { temp: -10, color: '#2563eb', label: '-10°C' },
        { temp: 0, color: '#3b82f6', label: '0°C' },
        { temp: 10, color: '#06b6d4', label: '10°C' },
        { temp: 20, color: '#22c55e', label: '20°C' },
        { temp: 30, color: '#eab308', label: '30°C' },
        { temp: 40, color: '#f97316', label: '40°C' },
        { temp: 50, color: '#ef4444', label: '50°C+' },
    ];

    return (
        <GlassCard className="p-5" delay={0.3}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-lg">🌡️</span>
                Temperature Heatmap
            </h3>

            <p className="text-xs text-gray-400 mb-4">
                Globe overlay shows temperature distribution with color-coded gradients.
            </p>

            {/* Gradient bar */}
            <div className="mb-3">
                <div
                    className="h-4 rounded-full"
                    style={{
                        background: `linear-gradient(to right, ${gradientStops.map((s) => s.color).join(', ')})`,
                    }}
                />
                <div className="flex justify-between mt-1.5">
                    {gradientStops.filter((_, i) => i % 2 === 0).map((stop, idx) => (
                        <motion.span
                            key={stop.temp}
                            className="text-[10px] text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 * idx }}
                        >
                            {stop.label}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Legend items */}
            <div className="grid grid-cols-4 gap-2 mt-4">
                {gradientStops.map((stop, idx) => (
                    <motion.div
                        key={stop.temp}
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                    >
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: stop.color }}
                        />
                        <span className="text-[10px] text-gray-400">{stop.label}</span>
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
}
