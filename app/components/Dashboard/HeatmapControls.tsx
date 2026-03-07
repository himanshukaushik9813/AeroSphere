'use client';

import { motion } from 'framer-motion';
import type { ViewMode } from '../../types/weather';

interface HeatmapControlsProps {
    viewMode: ViewMode;
    onToggle: (mode: ViewMode) => void;
}

const modes: { mode: ViewMode; label: string; icon: string; description: string; color: string }[] = [
    { mode: 'heatmap', label: 'Temperature', icon: '🌡️', description: 'Global thermal heatmap', color: '#ef4444' },
    { mode: 'aqi', label: 'Air Quality', icon: '🌿', description: 'Air quality index overlay', color: '#22c55e' },
    { mode: 'storm', label: 'Storm Alerts', icon: '⚡', description: 'Active storm tracking', color: '#f59e0b' },
    { mode: 'monsoon', label: 'Monsoon', icon: '🌧️', description: 'Indian monsoon analysis', color: '#3b82f6' },
];

export default function HeatmapControls({ viewMode, onToggle }: HeatmapControlsProps) {
    return (
        <motion.div
            className="flex flex-wrap items-center justify-center gap-3 px-4 lg:px-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
        >
            <span className="text-xs text-text-muted font-mono uppercase tracking-widest mr-1 hidden sm:flex items-center gap-2">
                <span className="w-3 h-[1px] bg-text-muted/30" />
                Layers
                <span className="w-3 h-[1px] bg-text-muted/30" />
            </span>

            {modes.map((m, i) => {
                const isActive = viewMode === m.mode;
                return (
                    <motion.button
                        key={m.mode}
                        onClick={() => onToggle(m.mode)}
                        className={`group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-400 interactive-btn ${isActive
                                ? 'border text-text-primary'
                                : 'bg-white/[0.03] border border-white/[0.06] text-text-muted hover:text-text-secondary hover:border-white/[0.12] hover:bg-white/[0.05]'
                            }`}
                        style={isActive ? {
                            background: `linear-gradient(145deg, ${m.color}15, ${m.color}08)`,
                            borderColor: `${m.color}40`,
                            boxShadow: `0 0 15px ${m.color}20, 0 0 30px ${m.color}08`,
                        } : {}}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 + 0.7 }}
                    >
                        {/* Neon indicator */}
                        <motion.div
                            className="w-2 h-2 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor: isActive ? m.color : 'rgba(88,89,99,0.3)',
                                boxShadow: isActive ? `0 0 8px ${m.color}80` : 'none',
                            }}
                            animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />

                        <span className="text-base">{m.icon}</span>
                        <span className="hidden sm:inline font-display">{m.label}</span>

                        {/* Active glow line */}
                        {isActive && (
                            <motion.div
                                className="absolute -bottom-[1px] left-4 right-4 h-[2px] rounded-full"
                                style={{ backgroundColor: m.color }}
                                layoutId="heatmapActiveBar"
                                transition={{ type: 'spring', bounce: 0.2 }}
                            />
                        )}

                        {/* Tooltip */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-bg-secondary/95 border border-white/[0.06] text-[10px] text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                            {m.description}
                        </div>
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
