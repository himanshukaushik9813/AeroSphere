/**
 * Weather Routes - REST API route definitions.
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/weatherController');

// Current weather
router.get('/weather', controller.getCurrentWeather);

// Location search suggestions
router.get('/locations/search', controller.searchLocations);

// Forecast (hourly + daily)
router.get('/forecast', controller.getForecast);

// Air Quality Index
router.get('/aqi', controller.getAQI);

// Storm alerts / extreme weather
router.get('/alerts', controller.getAlerts);

// AI rain prediction
router.get('/rain-prediction', controller.getRainPrediction);

// India monsoon mode
router.get('/monsoon', controller.getMonsoonData);

// Health check
router.get('/health', (req, res) => {
    res.json({ success: true, status: 'healthy', timestamp: Date.now() });
});

module.exports = router;
