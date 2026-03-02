/**
 * Rain Prediction Service - AI Simulation.
 * Computes rainfall probability from humidity and pressure
 * using a weighted formula. Serves as a placeholder for
 * future TensorFlow.js model integration.
 */

/**
 * Predict rainfall probability based on atmospheric conditions.
 * @param {number} humidity - Relative humidity (0-100)
 * @param {number} pressure - Atmospheric pressure in hPa
 * @param {number} [temperature] - Temperature in Celsius (optional)
 * @param {number} [cloudCover] - Cloud cover percentage (optional)
 * @returns {Object} Prediction result
 */
function predictRainfall(humidity, pressure, temperature = null, cloudCover = null) {
    // Normalize inputs
    const humidityNorm = Math.min(Math.max(humidity, 0), 100) / 100;

    // Pressure: lower pressure = higher rain probability
    // Normal range: 980-1040 hPa
    const pressureNorm = 1 - Math.min(Math.max((pressure - 980) / 60, 0), 1);

    // Base probability from humidity and pressure
    let probability = humidityNorm * 0.55 + pressureNorm * 0.35;

    // Adjust for temperature if available (dew point proximity)
    if (temperature !== null) {
        // Higher temperatures with high humidity = more likely rain
        const tempFactor = temperature > 25 ? 0.05 : temperature < 5 ? 0.03 : 0;
        probability += tempFactor;
    }

    // Adjust for cloud cover if available
    if (cloudCover !== null) {
        const cloudFactor = (cloudCover / 100) * 0.1;
        probability += cloudFactor;
    }

    // Clamp probability
    probability = Math.min(Math.max(probability, 0), 1);
    const probabilityPercent = Math.round(probability * 100);

    // Determine intensity
    let intensity = 'none';
    let description = 'No rain expected';

    if (probabilityPercent >= 80) {
        intensity = 'heavy';
        description = 'Heavy rainfall likely. Consider carrying an umbrella.';
    } else if (probabilityPercent >= 60) {
        intensity = 'moderate';
        description = 'Moderate rainfall expected. Rain gear recommended.';
    } else if (probabilityPercent >= 40) {
        intensity = 'light';
        description = 'Light showers possible. Stay prepared.';
    } else if (probabilityPercent >= 20) {
        intensity = 'drizzle';
        description = 'Slight chance of drizzle.';
    }

    return {
        probability: probabilityPercent,
        intensity,
        description,
        confidence: calculateConfidence(humidity, pressure),
        model: 'AeroSphere Rainfall Predictor v1.0',
        inputs: {
            humidity,
            pressure,
            temperature,
            cloudCover,
        },
        timestamp: Date.now(),
    };
}

/**
 * Calculate prediction confidence based on input quality.
 */
function calculateConfidence(humidity, pressure) {
    // More extreme values = higher confidence
    if (humidity > 90 || humidity < 20) return 'high';
    if (pressure < 990 || pressure > 1030) return 'high';
    if (humidity > 70 || humidity < 40) return 'medium';
    return 'low';
}

module.exports = { predictRainfall };
