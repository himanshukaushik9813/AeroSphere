/**
 * API Service - Axios instance and API call functions.
 */
import axios from 'axios';
import type {
    CurrentWeather,
    ForecastData,
    AQIData,
    AlertsData,
    RainPrediction,
    MonsoonData,
    ApiResponse,
    LocationSuggestion,
} from '../types/weather';

const configuredApiBase = process.env.NEXT_PUBLIC_API_URL?.trim();
const isProduction = process.env.NODE_ENV === 'production';
const API_BASE = configuredApiBase || (isProduction ? '' : 'http://localhost:4000/api');

function assertApiConfigured() {
    if (!API_BASE) {
        throw new Error(
            'Production API is not configured. Set NEXT_PUBLIC_API_URL in Vercel Project Settings and redeploy.'
        );
    }
}

const api = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const networkHint = API_BASE
            ? `Network error. Ensure backend is running at ${API_BASE} and backend CORS allows your frontend origin.`
            : 'Network error. Set NEXT_PUBLIC_API_URL in Vercel Project Settings and redeploy.';
        const message =
            error.response?.data?.error ||
            (error.message === 'Network Error' ? networkHint : error.message) ||
            networkHint;
        console.error(`[API Error] ${message}`);
        return Promise.reject(new Error(message));
    }
);

export async function fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    assertApiConfigured();
    const { data } = await api.get<ApiResponse<CurrentWeather>>('/weather', {
        params: { lat, lon },
    });
    return data.data;
}

export async function fetchLocationSuggestions(
    query: string,
    limit = 6
): Promise<LocationSuggestion[]> {
    assertApiConfigured();
    const { data } = await api.get<ApiResponse<LocationSuggestion[]>>('/locations/search', {
        params: { q: query, limit },
    });
    return data.data;
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
    assertApiConfigured();
    const { data } = await api.get<ApiResponse<ForecastData>>('/forecast', {
        params: { lat, lon },
    });
    return data.data;
}

export async function fetchAQI(lat: number, lon: number): Promise<AQIData> {
    assertApiConfigured();
    const { data } = await api.get<ApiResponse<AQIData>>('/aqi', {
        params: { lat, lon },
    });
    return data.data;
}

export async function fetchAlerts(lat: number, lon: number): Promise<AlertsData> {
    assertApiConfigured();
    const { data } = await api.get<ApiResponse<AlertsData>>('/alerts', {
        params: { lat, lon },
    });
    return data.data;
}

export async function fetchRainPrediction(
    humidity: number,
    pressure: number,
    temperature?: number,
    cloudCover?: number
): Promise<RainPrediction> {
    assertApiConfigured();
    const { data } = await api.get<ApiResponse<RainPrediction>>('/rain-prediction', {
        params: { humidity, pressure, temperature, cloudCover },
    });
    return data.data;
}

export async function fetchMonsoonData(): Promise<MonsoonData> {
    assertApiConfigured();
    const { data } = await api.get<ApiResponse<MonsoonData>>('/monsoon');
    return data.data;
}

export default api;
