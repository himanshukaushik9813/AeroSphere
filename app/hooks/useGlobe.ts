'use client';

/**
 * useGlobe - Custom hook for globe interaction state management.
 */
import { useState, useCallback } from 'react';
import type { ViewMode, Coordinates } from '../types/weather';

export function useGlobe() {
    const [viewMode, setViewMode] = useState<ViewMode>('default');
    const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(null);
    const [globeReady, setGlobeReady] = useState(false);

    const handleGlobeClick = useCallback((lat: number, lng: number) => {
        setSelectedCoords({ lat, lon: lng });
    }, []);

    const toggleViewMode = useCallback((mode: ViewMode) => {
        setViewMode((prev) => (prev === mode ? 'default' : mode));
    }, []);

    const onGlobeReady = useCallback(() => {
        setGlobeReady(true);
    }, []);

    return {
        viewMode,
        selectedCoords,
        globeReady,
        setViewMode,
        toggleViewMode,
        handleGlobeClick,
        onGlobeReady,
    };
}
