/**
 * Centralized configuration from environment variables.
 * All config values are accessed through this module.
 */
require('dotenv').config();

const configuredFrontendUrls = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((url) => url.trim()).filter(Boolean)
  : [process.env.FRONTEND_URL || 'http://localhost:3000'];

// Allow common local frontend dev ports by default outside production.
if ((process.env.NODE_ENV || 'development') !== 'production') {
  configuredFrontendUrls.push('http://localhost:3000', 'http://localhost:3001');
}

const frontendUrls = Array.from(new Set(configuredFrontendUrls));

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 4000,
  frontendUrl: frontendUrls[0],
  frontendUrls,

  // OpenWeatherMap
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
  openWeatherGeoUrl: 'https://api.openweathermap.org/geo/1.0',

  // Redis
  redisUrl: process.env.REDIS_URL || '',

  // Cache TTL in seconds (10 minutes)
  cacheTTL: 600,

  // WebSocket update interval in ms (60 seconds)
  wsUpdateInterval: 60000,
};

module.exports = config;
