/**
 * Cache Service - Redis with in-memory fallback.
 * Provides a unified caching interface with configurable TTL.
 * Falls back to in-memory Map when Redis is unavailable.
 */
const config = require('../config');

let redisClient = null;
let useInMemory = true;

// In-memory cache store
const memoryCache = new Map();

/**
 * Initialize Redis connection (optional).
 * Falls back to in-memory cache if Redis is unavailable.
 */
async function initCache() {
    if (!config.redisUrl) {
        console.log('[Cache] No REDIS_URL configured. Using in-memory cache.');
        return;
    }

    try {
        const Redis = require('ioredis');
        redisClient = new Redis(config.redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                if (times > 3) return null;
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });

        // Register listeners before connect to avoid unhandled error events.
        redisClient.on('error', (err) => {
            console.error('[Cache] Redis error:', err.message);
            useInMemory = true;
        });

        redisClient.on('reconnecting', () => {
            console.log('[Cache] Reconnecting to Redis...');
        });

        await redisClient.connect();
        useInMemory = false;
        console.log('[Cache] Connected to Redis successfully.');
    } catch (err) {
        console.warn('[Cache] Redis unavailable. Using in-memory cache.', err.message);
        useInMemory = true;
    }
}

/**
 * Get a cached value by key.
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Parsed cached value or null
 */
async function get(key) {
    try {
        if (useInMemory) {
            const entry = memoryCache.get(key);
            if (!entry) return null;
            if (Date.now() > entry.expiry) {
                memoryCache.delete(key);
                return null;
            }
            return entry.value;
        }

        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error('[Cache] Get error:', err.message);
        return null;
    }
}

/**
 * Set a cached value with TTL.
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be JSON-serialized)
 * @param {number} [ttl] - TTL in seconds (defaults to config.cacheTTL)
 */
async function set(key, value, ttl = config.cacheTTL) {
    try {
        if (useInMemory) {
            memoryCache.set(key, {
                value,
                expiry: Date.now() + ttl * 1000,
            });
            return;
        }

        await redisClient.setex(key, ttl, JSON.stringify(value));
    } catch (err) {
        console.error('[Cache] Set error:', err.message);
    }
}

/**
 * Delete a cached value.
 * @param {string} key - Cache key
 */
async function del(key) {
    try {
        if (useInMemory) {
            memoryCache.delete(key);
            return;
        }
        await redisClient.del(key);
    } catch (err) {
        console.error('[Cache] Del error:', err.message);
    }
}

module.exports = { initCache, get, set, del };
