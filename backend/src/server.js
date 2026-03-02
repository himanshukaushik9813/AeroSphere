/**
 * AeroSphere Backend Server
 * Express + WebSocket server for weather data.
 */
const http = require('http');
const express = require('express');
const cors = require('cors');
const config = require('./config');
const weatherRoutes = require('./routes/weatherRoutes');
const errorHandler = require('./middleware/errorHandler');
const { initCache } = require('./services/cacheService');
const { initWebSocket } = require('./websocket/wsServer');

const app = express();
const allowedOrigins = new Set(config.frontendUrls);

// Middleware
app.use(cors({
    origin(origin, callback) {
        // Allow non-browser requests (no Origin header).
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api', weatherRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'AeroSphere Weather API',
        version: '1.0.0',
        endpoints: [
            'GET /api/weather?lat=X&lon=Y',
            'GET /api/forecast?lat=X&lon=Y',
            'GET /api/aqi?lat=X&lon=Y',
            'GET /api/alerts?lat=X&lon=Y',
            'GET /api/rain-prediction?humidity=X&pressure=Y',
            'GET /api/monsoon',
            'GET /api/health',
            'WS /ws',
        ],
    });
});

// Error handling
app.use(errorHandler);

// Create HTTP server for both Express and WebSocket
const server = http.createServer(app);

// Initialize services and start server
async function start() {
    // Initialize cache (Redis or in-memory fallback)
    await initCache();

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(
                `[Server] Port ${config.port} is already in use. Stop the existing process or change PORT in backend/.env.`
            );
        } else {
            console.error('[Server] Failed to start:', err.message);
        }
        process.exit(1);
    });

    // Initialize WebSocket server
    initWebSocket(server);

    // Start listening
    server.listen(config.port, () => {
        console.log(`\n🌍 AeroSphere Backend running on port ${config.port}`);
        console.log(`   REST API: http://localhost:${config.port}/api`);
        console.log(`   WebSocket: ws://localhost:${config.port}/ws`);
        console.log(`   Frontend origins: ${config.frontendUrls.join(', ')}\n`);
    });
}

start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
