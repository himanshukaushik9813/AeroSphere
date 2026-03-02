'use client';

/**
 * GlobeView - Interactive 3D globe using react-globe.gl.
 * Supports click-to-coordinates, heatmap, storm, AQI, and monsoon overlays.
 */
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { ViewMode, GlobePoint, MonsoonCityData } from '../../types/weather';
import { tempToColor } from '../../utils/helpers';
import GeoTextNebula from '../UI/GeoTextNebula';

// Dynamically import Globe to avoid SSR issues with Three.js
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface GlobeViewProps {
    viewMode: ViewMode;
    onGlobeClick: (lat: number, lng: number) => void;
    onGlobeReady: () => void;
    monsoonCities?: MonsoonCityData[];
    selectedCoords?: { lat: number; lon: number } | null;
}

// Sample heatmap data (world cities with typical temps)
const HEATMAP_POINTS: GlobePoint[] = [
    { lat: 28.61, lng: 77.21, value: 32, label: 'Delhi' },
    { lat: 19.07, lng: 72.88, value: 30, label: 'Mumbai' },
    { lat: 40.71, lng: -74.01, value: 12, label: 'New York' },
    { lat: 51.51, lng: -0.13, value: 8, label: 'London' },
    { lat: 35.68, lng: 139.69, value: 15, label: 'Tokyo' },
    { lat: -33.87, lng: 151.21, value: 22, label: 'Sydney' },
    { lat: 55.76, lng: 37.62, value: -5, label: 'Moscow' },
    { lat: 1.35, lng: 103.82, value: 31, label: 'Singapore' },
    { lat: 25.20, lng: 55.27, value: 38, label: 'Dubai' },
    { lat: -23.55, lng: -46.63, value: 26, label: 'São Paulo' },
    { lat: 48.86, lng: 2.35, value: 10, label: 'Paris' },
    { lat: 39.91, lng: 116.40, value: 14, label: 'Beijing' },
    { lat: 30.04, lng: 31.24, value: 28, label: 'Cairo' },
    { lat: -1.29, lng: 36.82, value: 24, label: 'Nairobi' },
    { lat: 13.08, lng: 80.27, value: 33, label: 'Chennai' },
    { lat: 22.57, lng: 88.36, value: 31, label: 'Kolkata' },
    { lat: 12.97, lng: 77.59, value: 27, label: 'Bengaluru' },
    { lat: 34.05, lng: -118.24, value: 20, label: 'Los Angeles' },
    { lat: 41.90, lng: 12.50, value: 16, label: 'Rome' },
    { lat: -34.60, lng: -58.38, value: 24, label: 'Buenos Aires' },
];

// Storm-prone regions
const STORM_POINTS: GlobePoint[] = [
    { lat: 25.76, lng: -80.19, value: 1, label: 'Miami - Hurricane Zone', color: '#ef4444' },
    { lat: 14.60, lng: 120.98, value: 1, label: 'Manila - Typhoon Zone', color: '#f97316' },
    { lat: 22.32, lng: 114.17, value: 1, label: 'Hong Kong - Typhoon Zone', color: '#f97316' },
    { lat: 23.81, lng: 90.41, value: 1, label: 'Dhaka - Cyclone Zone', color: '#ef4444' },
    { lat: 19.07, lng: 72.88, value: 1, label: 'Mumbai - Cyclone Zone', color: '#f97316' },
    { lat: 29.95, lng: -90.07, value: 1, label: 'New Orleans - Hurricane Zone', color: '#ef4444' },
];

export default function GlobeView({
    viewMode,
    onGlobeClick,
    onGlobeReady,
    monsoonCities = [],
    selectedCoords,
}: GlobeViewProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globeRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ w: 600, h: 600 });

    // Set initial globe view
    useEffect(() => {
        const globe = globeRef.current as { pointOfView?: (coords: object, ms: number) => void };
        if (globe?.pointOfView) {
            // Start with a view of India
            globe.pointOfView({ lat: 20, lng: 78, altitude: 2.5 }, 1000);
        }
    }, []);

    // Responsive sizing
    useEffect(() => {
        const updateSize = () => {
            const w = Math.min(window.innerWidth * 0.55, 700);
            const h = Math.min(window.innerHeight * 0.75, 700);
            setDimensions({ w, h });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Get points based on view mode
    const points = useMemo(() => {
        switch (viewMode) {
            case 'heatmap':
                return HEATMAP_POINTS.map((p) => ({
                    ...p,
                    color: tempToColor(p.value || 0),
                    size: 0.6,
                }));
            case 'storm':
                return STORM_POINTS.map((p) => ({
                    ...p,
                    size: 0.8,
                }));
            case 'monsoon':
                return monsoonCities.map((city) => ({
                    lat: city.lat,
                    lng: city.lon,
                    label: `${city.name}: ${city.temp}°C, ${city.humidity}% humidity`,
                    color: city.rainfall > 0 ? '#3b82f6' : '#06b6d4',
                    size: Math.max(0.3, city.rainfall / 10),
                    value: city.rainfall,
                }));
            default:
                return selectedCoords
                    ? [
                        {
                            lat: selectedCoords.lat,
                            lng: selectedCoords.lon,
                            label: 'Selected',
                            color: '#06b6d4',
                            size: 0.5,
                            value: 1,
                        },
                    ]
                    : [];
        }
    }, [viewMode, monsoonCities, selectedCoords]);

    // Rings data for selected location
    const ringsData = useMemo(() => {
        if (selectedCoords) {
            return [
                {
                    lat: selectedCoords.lat,
                    lng: selectedCoords.lon,
                    maxR: 3,
                    propagationSpeed: 2,
                    repeatPeriod: 800,
                },
            ];
        }
        return [];
    }, [selectedCoords]);

    // Handle globe click
    const handleClick = useCallback(
        (point: { lat: number; lng: number }) => {
            if (point?.lat !== undefined && point?.lng !== undefined) {
                onGlobeClick(point.lat, point.lng);

                // Animate to clicked location
                const globe = globeRef.current as { pointOfView?: (coords: object, ms: number) => void };
                if (globe?.pointOfView) {
                    globe.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.8 }, 800);
                }
            }
        },
        [onGlobeClick]
    );

    return (
        <div className="relative flex items-center justify-center">
            {/* Ambient glow behind globe */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="rounded-full blur-3xl opacity-20"
                    style={{
                        width: dimensions.w * 0.8,
                        height: dimensions.h * 0.8,
                        background:
                            viewMode === 'heatmap'
                                ? 'radial-gradient(circle, #f97316, #ef4444, transparent)'
                                : viewMode === 'storm'
                                    ? 'radial-gradient(circle, #ef4444, #7c3aed, transparent)'
                                    : viewMode === 'aqi'
                                        ? 'radial-gradient(circle, #22c55e, #3b82f6, transparent)'
                                        : viewMode === 'monsoon'
                                            ? 'radial-gradient(circle, #3b82f6, #06b6d4, transparent)'
                                            : 'radial-gradient(circle, #06b6d4, #3b82f6, transparent)',
                    }}
                />
            </div>

            <Globe
                ref={globeRef}
                width={dimensions.w}
                height={dimensions.h}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                atmosphereColor={
                    viewMode === 'heatmap'
                        ? '#f97316'
                        : viewMode === 'storm'
                            ? '#ef4444'
                            : viewMode === 'monsoon'
                                ? '#3b82f6'
                                : '#06b6d4'
                }
                atmosphereAltitude={0.18}
                // Points layer
                pointsData={points}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.01}
                pointRadius="size"
                pointsMerge={true}
                // Rings layer for selected location
                ringsData={ringsData}
                ringColor={() => '#06b6d4'}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
                // Labels
                labelsData={viewMode !== 'default' ? points.slice(0, 10) : []}
                labelLat="lat"
                labelLng="lng"
                labelText="label"
                labelSize={0.8}
                labelColor={() => 'rgba(255, 255, 255, 0.75)'}
                labelDotRadius={0.3}
                labelAltitude={0.02}
                // Click handler
                onGlobeClick={handleClick}
                onGlobeReady={onGlobeReady}
                animateIn={true}
            />

            {/* View mode indicator */}
            <AnimatePresence>
                {viewMode !== 'default' && (
                    <motion.div
                        className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.1] text-xs font-medium text-white"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {viewMode === 'heatmap' && '🌡️ Heatmap Mode'}
                        {viewMode === 'storm' && '⚡ Storm Alert Mode'}
                        {viewMode === 'aqi' && '🌿 Air Quality Mode'}
                        {viewMode === 'monsoon' && '🌧️ Monsoon Mode'}
                    </motion.div>
                )}
            </AnimatePresence>

            <GeoTextNebula />

            {/* Click hint */}
            {!selectedCoords && (
                <motion.div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] text-xs text-gray-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                >
                    🌍 Click anywhere on the globe to get weather data
                </motion.div>
            )}
        </div>
    );
}
