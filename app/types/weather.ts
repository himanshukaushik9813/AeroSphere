/**
 * TypeScript interfaces for all weather data types.
 */

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface LocationSuggestion {
    name: string;
    country: string;
    state: string | null;
    lat: number;
    lon: number;
}

export interface CurrentWeather {
    location: string;
    country: string;
    coordinates: Coordinates;
    temperature: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDeg: number;
    visibility: number;
    clouds: number;
    condition: string;
    description: string;
    icon: string;
    sunrise: number;
    sunset: number;
    timezone: number;
    dt: number;
}

export interface HourlyForecastItem {
    dt: number;
    temp: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    condition: string;
    description: string;
    icon: string;
    pop: number;
}

export interface DailyForecastItem {
    dt: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    condition: string;
    icon: string;
    pop: number;
}

export interface ForecastData {
    hourly: HourlyForecastItem[];
    daily: DailyForecastItem[];
    city: {
        name: string;
        country: string;
    };
}

export interface AQIData {
    aqi: number;
    components: {
        co: number;
        no: number;
        no2: number;
        o3: number;
        so2: number;
        pm2_5: number;
        pm10: number;
        nh3: number;
    };
    dt: number;
    aqiLabel: string;
    aqiColor: string;
}

export interface Alert {
    type: string;
    severity: 'severe' | 'extreme';
    title: string;
    description: string;
}

export interface AlertsData {
    alerts: Alert[];
    hasAlerts: boolean;
    location: string;
    dt: number;
}

export interface RainPrediction {
    probability: number;
    intensity: string;
    description: string;
    confidence: string;
    model: string;
    inputs: {
        humidity: number;
        pressure: number;
        temperature: number | null;
        cloudCover: number | null;
    };
    timestamp: number;
}

export interface MonsoonCityData {
    name: string;
    lat: number;
    lon: number;
    temp: number;
    humidity: number;
    rainfall: number;
    condition: string;
    description: string;
    icon: string;
    windSpeed: number;
    clouds: number;
}

export interface MonsoonData {
    cities: MonsoonCityData[];
    timestamp: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

export interface GlobePoint {
    lat: number;
    lng: number;
    label?: string;
    color?: string;
    size?: number;
    value?: number;
}

export type ViewMode = 'default' | 'heatmap' | 'storm' | 'aqi' | 'monsoon';
