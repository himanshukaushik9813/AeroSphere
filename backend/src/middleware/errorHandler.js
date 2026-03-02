/**
 * Global error handling middleware.
 * Catches all errors and returns structured JSON responses.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);

    // Axios errors from external API calls
    if (err.response) {
        const status = err.response.status;
        const isOpenWeather =
            typeof err.config?.url === 'string' && err.config.url.includes('openweathermap.org');

        if (isOpenWeather && status === 401) {
            return res.status(500).json({
                success: false,
                error: 'OpenWeather authentication failed. Check OPENWEATHER_API_KEY in backend/.env.',
                code: 'OPENWEATHER_AUTH_FAILED',
            });
        }

        const message = err.response.data?.message || 'External API error';
        return res.status(status).json({
            success: false,
            error: message,
            code: status,
        });
    }

    // Custom application errors
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            code: err.statusCode,
        });
    }

    // Default server error
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 500,
    });
};

module.exports = errorHandler;
