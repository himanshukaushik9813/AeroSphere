'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { ViewMode, MonsoonCityData } from '../../types/weather';

const GlobeView = dynamic(() => import('../Globe/GlobeView'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
                <motion.div
                    className="w-20 h-20 rounded-full border-2 border-accent-primary/30 border-t-accent-primary mx-auto mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-base text-text-muted font-mono tracking-wider">Initializing Globe<span className="animate-data-pulse">...</span></p>
                <p className="text-xs text-text-muted/50 mt-1">Loading 3D visualization engine</p>
            </div>
        </div>
    ),
});

interface GlobeSectionProps {
    viewMode: ViewMode;
    onGlobeClick: (lat: number, lng: number) => void;
    onGlobeReady: () => void;
    monsoonCities?: MonsoonCityData[];
    selectedCoords: { lat: number; lon: number } | null;
    hasWeatherData: boolean;
}

export default function GlobeSection({
    viewMode,
    onGlobeClick,
    onGlobeReady,
    monsoonCities,
    selectedCoords,
    hasWeatherData,
}: GlobeSectionProps) {
    return (
        <section id="globe" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
            {/* Multi-layer background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-accent-primary/[0.03] blur-[140px]"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-blue-900/[0.04] blur-[120px]"
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 grid-bg opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 lg:px-8">
                <div className="flex flex-col items-center">
                    {/* Title + HUD bar */}
                    <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3">
                            <span className="gradient-text">Global Weather</span>{' '}
                            <span className="gradient-text-accent">Intelligence</span>
                        </h1>
                        <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
                            Real-time satellite monitoring and climate analytics powered by AI
                        </p>
                    </motion.div>

                    {/* HUD badges */}
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-3 mb-6"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <motion.div
                                className="w-2 h-2 rounded-full bg-accent-primary"
                                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-xs text-text-secondary font-mono uppercase tracking-wider">
                                {viewMode === 'default' ? '● Standard View' : '● ' + viewMode.toUpperCase() + ' Mode'}
                            </span>
                        </div>

                        {selectedCoords && (
                            <motion.div
                                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-accent-primary/[0.06] border border-accent-primary/20"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-primary">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                <span className="text-xs text-accent-primary font-mono font-bold">
                                    {selectedCoords.lat.toFixed(4)}°, {selectedCoords.lon.toFixed(4)}°
                                </span>
                            </motion.div>
                        )}

                        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-xs text-text-muted font-mono">🛰️ Satellite Feed Active</span>
                        </div>
                    </motion.div>

                    {/* Globe container */}
                    <motion.div
                        className="globe-container relative"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                    >
                        {/* Animated orbit rings */}
                        <motion.div
                            className="absolute inset-[-30px] rounded-full border border-accent-primary/[0.08] pointer-events-none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-[-55px] rounded-full border border-accent-tertiary/[0.05] pointer-events-none"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-[-80px] rounded-full border border-white/[0.02] pointer-events-none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Floating dots on orbit */}
                        <motion.div
                            className="absolute -top-3 left-1/2 w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(179,12,11,0.5)] pointer-events-none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                            style={{ transformOrigin: '0 calc(50% + 30px)' }}
                        />

                        {/* Globe with float */}
                        <motion.div
                            animate={{ y: [0, -14, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Suspense fallback={
                                <div className="flex items-center justify-center" style={{ width: 600, height: 600 }}>
                                    <motion.div
                                        className="w-20 h-20 rounded-full border-2 border-accent-primary/30 border-t-accent-primary"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                    />
                                </div>
                            }>
                                <GlobeView
                                    viewMode={viewMode}
                                    onGlobeClick={onGlobeClick}
                                    onGlobeReady={onGlobeReady}
                                    monsoonCities={monsoonCities}
                                    selectedCoords={selectedCoords}
                                />
                            </Suspense>
                        </motion.div>
                    </motion.div>

                    {/* Click prompt */}
                    {!hasWeatherData && (
                        <motion.div
                            className="mt-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-accent-primary/[0.06] border border-accent-primary/20 cursor-pointer interactive-btn"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(179,12,11,0.15)' }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    🌍
                                </motion.div>
                                <div className="text-left">
                                    <span className="text-sm text-accent-primary font-display font-semibold block">Click to Explore</span>
                                    <span className="text-[10px] text-text-muted">Rotate, zoom, and click any location</span>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-primary/60">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
