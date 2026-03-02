/**
 * Weather Controller - Request handlers for all weather endpoints.
 * Validates input, delegates to services, and formats responses.
 */
const weatherService = require('../services/weatherService');
const rainPrediction = require('../services/rainPredictionService');

/**
 * GET /api/weather?lat=X&lon=Y
 * Fetch current weather for given coordinates.
 */
async function getCurrentWeather(req, res, next) {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: lat, lon',
            });
        }

        const data = await weatherService.getCurrentWeather(
            parseFloat(lat),
            parseFloat(lon)
        );

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/forecast?lat=X&lon=Y
 * Fetch forecast data (hourly + daily).
 */
async function getForecast(req, res, next) {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: lat, lon',
            });
        }

        const data = await weatherService.getForecast(
            parseFloat(lat),
            parseFloat(lon)
        );

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/aqi?lat=X&lon=Y
 * Fetch Air Quality Index data.
 */
async function getAQI(req, res, next) {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: lat, lon',
            });
        }

        const data = await weatherService.getAQI(
            parseFloat(lat),
            parseFloat(lon)
        );

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/alerts?lat=X&lon=Y
 * Fetch storm alerts / extreme weather data.
 */
async function getAlerts(req, res, next) {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: lat, lon',
            });
        }

        const data = await weatherService.getAlerts(
            parseFloat(lat),
            parseFloat(lon)
        );

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/rain-prediction?humidity=X&pressure=Y
 * Get AI rain prediction based on atmospheric conditions.
 */
async function getRainPrediction(req, res, next) {
    try {
        const { humidity, pressure, temperature, cloudCover } = req.query;
        if (!humidity || !pressure) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: humidity, pressure',
            });
        }

        const prediction = rainPrediction.predictRainfall(
            parseFloat(humidity),
            parseFloat(pressure),
            temperature ? parseFloat(temperature) : null,
            cloudCover ? parseFloat(cloudCover) : null
        );

        res.json({ success: true, data: prediction });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/monsoon
 * Fetch Indian monsoon mode data.
 */
async function getMonsoonData(req, res, next) {
    try {
        const data = await weatherService.getMonsoonData();
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/locations/search?q=city&limit=6
 * Search location suggestions by city name.
 */
async function searchLocations(req, res, next) {
    try {
        const q = String(req.query.q || '').trim();
        const parsedLimit = parseInt(req.query.limit, 10);
        const limit = Number.isFinite(parsedLimit) ? parsedLimit : 6;

        if (q.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Query must be at least 2 characters',
            });
        }

        const data = await weatherService.searchLocations(q, limit);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getCurrentWeather,
    getForecast,
    getAQI,
    getAlerts,
    getRainPrediction,
    getMonsoonData,
    searchLocations,
};
