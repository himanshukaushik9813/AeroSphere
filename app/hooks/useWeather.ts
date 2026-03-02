'use client';

/**
 * useWeather - Custom hook for fetching and managing weather state.
 */
import { useState, useCallback } from 'react';
import type {
    CurrentWeather,
    ForecastData,
    AQIData,
    AlertsData,
    RainPrediction,
    MonsoonData,
    Coordinates,
} from '../types/weather';
import {
    fetchCurrentWeather,
    fetchForecast,
    fetchAQI,
    fetchAlerts,
    fetchRainPrediction,
    fetchMonsoonData,
} from '../services/api';

interface WeatherState {
    weather: CurrentWeather | null;
    forecast: ForecastData | null;
    aqi: AQIData | null;
    alerts: AlertsData | null;
    rainPrediction: RainPrediction | null;
    monsoon: MonsoonData | null;
    loading: boolean;
    error: string | null;
    selectedLocation: Coordinates | null;
}

export function useWeather() {
    const [state, setState] = useState<WeatherState>({
        weather: null,
        forecast: null,
        aqi: null,
        alerts: null,
        rainPrediction: null,
        monsoon: null,
        loading: false,
        error: null,
        selectedLocation: null,
    });

    const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
        setState((prev) => ({ ...prev, loading: true, error: null, selectedLocation: { lat, lon } }));

        try {
            const [weather, forecast, aqi, alerts] = await Promise.all([
                fetchCurrentWeather(lat, lon),
                fetchForecast(lat, lon),
                fetchAQI(lat, lon).catch(() => null),
                fetchAlerts(lat, lon).catch(() => null),
            ]);

            // Fetch rain prediction if we have weather data
            let rainPred: RainPrediction | null = null;
            if (weather) {
                try {
                    rainPred = await fetchRainPrediction(
                        weather.humidity,
                        weather.pressure,
                        weather.temperature,
                        weather.clouds
                    );
                } catch {
                    // Rain prediction is optional
                }
            }

            setState((prev) => ({
                ...prev,
                weather,
                forecast,
                aqi,
                alerts,
                rainPrediction: rainPred,
                loading: false,
                error: null,
            }));
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err.message : 'Failed to fetch weather data',
            }));
        }
    }, []);

    const fetchMonsoon = useCallback(async () => {
        try {
            const monsoon = await fetchMonsoonData();
            setState((prev) => ({ ...prev, monsoon }));
        } catch (err) {
            console.error('Failed to fetch monsoon data:', err);
        }
    }, []);

    const updateWeatherFromWS = useCallback(
        (data: { weather: CurrentWeather; aqi: AQIData | null }) => {
            setState((prev) => ({
                ...prev,
                weather: data.weather,
                aqi: data.aqi || prev.aqi,
            }));
        },
        []
    );

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    return {
        ...state,
        fetchWeatherData,
        fetchMonsoon,
        updateWeatherFromWS,
        clearError,
    };
}
