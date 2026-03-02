/**
 * WebSocket Server - Real-time weather update push.
 * Clients subscribe with { lat, lon } and receive
 * weather updates every 60 seconds.
 */
const { WebSocketServer } = require('ws');
const weatherService = require('../services/weatherService');
const config = require('../config');

/**
 * Initialize WebSocket server on the given HTTP server.
 * @param {import('http').Server} server - HTTP server instance
 */
function initWebSocket(server) {
    const wss = new WebSocketServer({ server, path: '/ws' });

    console.log('[WebSocket] Server initialized on /ws');

    wss.on('error', (err) => {
        console.error('[WebSocket] Server error:', err.message);
    });

    wss.on('connection', (ws) => {
        console.log('[WebSocket] Client connected');

        let subscription = null;
        let updateInterval = null;

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());

                if (data.type === 'subscribe' && data.lat && data.lon) {
                    subscription = { lat: parseFloat(data.lat), lon: parseFloat(data.lon) };
                    console.log(`[WebSocket] Subscribed to ${subscription.lat}, ${subscription.lon}`);

                    // Send initial data immediately
                    await sendWeatherUpdate(ws, subscription);

                    // Clear existing interval if re-subscribing
                    if (updateInterval) clearInterval(updateInterval);

                    // Set up periodic updates
                    updateInterval = setInterval(async () => {
                        if (ws.readyState === ws.OPEN && subscription) {
                            await sendWeatherUpdate(ws, subscription);
                        }
                    }, config.wsUpdateInterval);
                }

                if (data.type === 'unsubscribe') {
                    subscription = null;
                    if (updateInterval) clearInterval(updateInterval);
                    ws.send(JSON.stringify({ type: 'unsubscribed' }));
                }
            } catch (err) {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
            }
        });

        ws.on('close', () => {
            console.log('[WebSocket] Client disconnected');
            if (updateInterval) clearInterval(updateInterval);
            subscription = null;
        });

        ws.on('error', (err) => {
            console.error('[WebSocket] Error:', err.message);
            if (updateInterval) clearInterval(updateInterval);
        });

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'connected',
            message: 'Connected to AeroSphere Weather WS',
            updateInterval: config.wsUpdateInterval,
        }));
    });

    return wss;
}

/**
 * Push weather update to a client.
 */
async function sendWeatherUpdate(ws, { lat, lon }) {
    try {
        const [weather, aqi] = await Promise.all([
            weatherService.getCurrentWeather(lat, lon),
            weatherService.getAQI(lat, lon).catch(() => null),
        ]);

        ws.send(JSON.stringify({
            type: 'weather_update',
            data: { weather, aqi },
            timestamp: Date.now(),
        }));
    } catch (err) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to fetch weather update',
        }));
    }
}

module.exports = { initWebSocket };
