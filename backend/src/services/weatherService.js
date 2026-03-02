/**
 * Weather Service - OpenWeatherMap API integration.
 * Handles all weather data fetching and transformation.
 */
const axios = require('axios');
const config = require('../config');
const cache = require('./cacheService');

const api = axios.create({
    timeout: 10000,
});

function assertOpenWeatherApiKey() {
    const key = (config.openWeatherApiKey || '').trim();
    const looksPlaceholder =
        !key ||
        key.toLowerCase().includes('your_') ||
        key.toLowerCase().includes('key_here') ||
        key.toLowerCase().includes('real_key');

    if (looksPlaceholder) {
        const err = new Error(
            'OPENWEATHER_API_KEY is missing or placeholder. Set a real key in backend/.env and restart backend.'
        );
        err.statusCode = 500;
        throw err;
    }
}

/**
 * Search locations by city name using OpenWeather Geocoding API.
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<Array<{name: string, country: string, state: string|null, lat: number, lon: number}>>}
 */
async function searchLocations(query, limit = 6) {
    assertOpenWeatherApiKey();

    const normalized = String(query || '').trim();
    if (!normalized) return [];

    const safeLimit = Math.max(1, Math.min(10, Number(limit) || 6));
    const cacheKey = `geo:${normalized.toLowerCase()}:${safeLimit}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await api.get(`${config.openWeatherGeoUrl}/direct`, {
        params: {
            q: normalized,
            limit: safeLimit,
            appid: config.openWeatherApiKey,
        },
    });

    const result = data.map((item) => ({
        name: item.name,
        country: item.country,
        state: item.state || null,
        lat: item.lat,
        lon: item.lon,
    }));

    // Location search is relatively stable; cache for 24h.
    await cache.set(cacheKey, result, 86400);
    return result;
}

/**
 * Fetch current weather data for given coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Transformed weather data
 */
async function getCurrentWeather(lat, lon) {
    assertOpenWeatherApiKey();

    const cacheKey = `weather:${lat}:${lon}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await api.get(`${config.openWeatherBaseUrl}/weather`, {
        params: {
            lat,
            lon,
            appid: config.openWeatherApiKey,
            units: 'metric',
        },
    });

    const result = {
        location: data.name,
        country: data.sys?.country,
        coordinates: { lat: data.coord.lat, lon: data.coord.lon },
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,
        visibility: data.visibility,
        clouds: data.clouds.all,
        condition: data.weather[0]?.main,
        description: data.weather[0]?.description,
        icon: data.weather[0]?.icon,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
        dt: data.dt,
    };

    await cache.set(cacheKey, result);
    return result;
}

/**
 * Fetch 5-day / 3-hour forecast data.
 * Transforms into hourly (next 24h) and daily (next 10 entries) arrays.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>} { hourly: [], daily: [] }
 */
async function getForecast(lat, lon) {
    assertOpenWeatherApiKey();

    const cacheKey = `forecast:${lat}:${lon}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await api.get(`${config.openWeatherBaseUrl}/forecast`, {
        params: {
            lat,
            lon,
            appid: config.openWeatherApiKey,
            units: 'metric',
        },
    });

    // Hourly: next 8 entries (24 hours at 3-hour intervals)
    const hourly = data.list.slice(0, 8).map((item) => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        condition: item.weather[0]?.main,
        description: item.weather[0]?.description,
        icon: item.weather[0]?.icon,
        pop: item.pop, // Probability of precipitation
    }));

    // Daily: aggregate by day (up to 10 days from 5-day data)
    const dailyMap = new Map();
    data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(date)) {
            dailyMap.set(date, {
                dt: item.dt,
                temps: [],
                humidity: [],
                conditions: [],
                icons: [],
                pop: [],
            });
        }
        const day = dailyMap.get(date);
        day.temps.push(item.main.temp);
        day.humidity.push(item.main.humidity);
        day.conditions.push(item.weather[0]?.main);
        day.icons.push(item.weather[0]?.icon);
        day.pop.push(item.pop || 0);
    });

    const daily = Array.from(dailyMap.values())
        .slice(0, 10)
        .map((day) => ({
            dt: day.dt,
            tempMin: Math.round(Math.min(...day.temps)),
            tempMax: Math.round(Math.max(...day.temps)),
            humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            condition: getMostFrequent(day.conditions),
            icon: getMostFrequent(day.icons),
            pop: Math.round(Math.max(...day.pop) * 100),
        }));

    const result = { hourly, daily, city: data.city };
    await cache.set(cacheKey, result);
    return result;
}

/**
 * Fetch Air Quality Index data.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>} AQI data
 */
async function getAQI(lat, lon) {
    assertOpenWeatherApiKey();

    const cacheKey = `aqi:${lat}:${lon}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await api.get(`${config.openWeatherBaseUrl}/air_pollution`, {
        params: {
            lat,
            lon,
            appid: config.openWeatherApiKey,
        },
    });

    const aqiItem = data.list[0];
    const result = {
        aqi: aqiItem.main.aqi, // 1-5 scale
        components: aqiItem.components,
        dt: aqiItem.dt,
        aqiLabel: getAQILabel(aqiItem.main.aqi),
        aqiColor: getAQIColor(aqiItem.main.aqi),
    };

    await cache.set(cacheKey, result);
    return result;
}

/**
 * Fetch weather alerts / extreme weather data.
 * Uses current weather data to detect extremes since alerts
 * require OneCall API subscription.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>} Alerts data
 */
async function getAlerts(lat, lon) {
    assertOpenWeatherApiKey();

    const cacheKey = `alerts:${lat}:${lon}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    // Fetch current weather to derive storm conditions
    const { data } = await api.get(`${config.openWeatherBaseUrl}/weather`, {
        params: {
            lat,
            lon,
            appid: config.openWeatherApiKey,
            units: 'metric',
        },
    });

    const alerts = [];
    const weather = data.weather[0];

    // Detect extreme conditions
    if (data.wind.speed > 20) {
        alerts.push({
            type: 'wind',
            severity: data.wind.speed > 30 ? 'extreme' : 'severe',
            title: 'High Wind Warning',
            description: `Wind speeds of ${data.wind.speed} m/s detected`,
        });
    }

    if (data.main.temp > 45) {
        alerts.push({
            type: 'heat',
            severity: 'extreme',
            title: 'Extreme Heat Warning',
            description: `Temperature of ${Math.round(data.main.temp)}°C detected`,
        });
    }

    if (data.main.temp < -20) {
        alerts.push({
            type: 'cold',
            severity: 'extreme',
            title: 'Extreme Cold Warning',
            description: `Temperature of ${Math.round(data.main.temp)}°C detected`,
        });
    }

    if (['Thunderstorm'].includes(weather?.main)) {
        alerts.push({
            type: 'storm',
            severity: 'severe',
            title: 'Thunderstorm Alert',
            description: weather.description,
        });
    }

    if (data.rain?.['1h'] > 50 || data.rain?.['3h'] > 100) {
        alerts.push({
            type: 'rain',
            severity: 'severe',
            title: 'Heavy Rainfall Warning',
            description: `Heavy precipitation detected in the area`,
        });
    }

    const result = {
        alerts,
        hasAlerts: alerts.length > 0,
        location: data.name,
        dt: data.dt,
    };

    await cache.set(cacheKey, result);
    return result;
}

/**
 * Fetch monsoon-related data for Indian subcontinent.
 * @returns {Promise<Object>} Monsoon data for key Indian cities
 */
async function getMonsoonData() {
    assertOpenWeatherApiKey();

    const cacheKey = 'monsoon:india';
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    // Key Indian cities to track monsoon
    const cities = [
        { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
        { name: 'Delhi', lat: 28.6139, lon: 77.209 },
        { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
        { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
        { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
        { name: 'Kochi', lat: 9.9312, lon: 76.2673 },
        { name: 'Guwahati', lat: 26.1445, lon: 91.7362 },
        { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    ];

    const monsoonData = await Promise.all(
        cities.map(async (city) => {
            try {
                const { data } = await api.get(`${config.openWeatherBaseUrl}/weather`, {
                    params: {
                        lat: city.lat,
                        lon: city.lon,
                        appid: config.openWeatherApiKey,
                        units: 'metric',
                    },
                });

                return {
                    name: city.name,
                    lat: city.lat,
                    lon: city.lon,
                    temp: Math.round(data.main.temp),
                    humidity: data.main.humidity,
                    rainfall: data.rain?.['1h'] || data.rain?.['3h'] || 0,
                    condition: data.weather[0]?.main,
                    description: data.weather[0]?.description,
                    icon: data.weather[0]?.icon,
                    windSpeed: data.wind.speed,
                    clouds: data.clouds.all,
                };
            } catch (err) {
                return { name: city.name, lat: city.lat, lon: city.lon, error: true };
            }
        })
    );

    const result = {
        cities: monsoonData.filter((c) => !c.error),
        timestamp: Date.now(),
    };

    await cache.set(cacheKey, result, 300); // 5-minute cache for monsoon
    return result;
}

// --- Helpers ---

function getMostFrequent(arr) {
    const freq = {};
    arr.forEach((item) => {
        freq[item] = (freq[item] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function getAQILabel(aqi) {
    const labels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return labels[aqi] || 'Unknown';
}

function getAQIColor(aqi) {
    const colors = ['', '#4ade80', '#a3e635', '#facc15', '#f97316', '#ef4444'];
    return colors[aqi] || '#6b7280';
}

module.exports = {
    searchLocations,
    getCurrentWeather,
    getForecast,
    getAQI,
    getAlerts,
    getMonsoonData,
};
