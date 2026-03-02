/**
 * Utility helpers for weather data formatting.
 */

/**
 * Format Unix timestamp to time string (HH:MM).
 */
export function formatTime(timestamp: number, timezone?: number): string {
    const date = new Date((timestamp + (timezone || 0)) * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format Unix timestamp to day name.
 */
export function formatDay(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Format Unix timestamp to full date.
 */
export function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Get weather icon URL from OpenWeatherMap.
 */
export function getWeatherIconUrl(icon: string, size: '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}

/**
 * Convert wind degrees to compass direction.
 */
export function windDirection(deg: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
}

/**
 * Get AQI level details.
 */
export function getAQILevel(aqi: number): { label: string; color: string; emoji: string } {
    const levels = [
        { label: 'Unknown', color: '#6b7280', emoji: '❓' },
        { label: 'Good', color: '#4ade80', emoji: '😊' },
        { label: 'Fair', color: '#a3e635', emoji: '🙂' },
        { label: 'Moderate', color: '#facc15', emoji: '😐' },
        { label: 'Poor', color: '#f97316', emoji: '😷' },
        { label: 'Very Poor', color: '#ef4444', emoji: '🤢' },
    ];
    return levels[aqi] || levels[0];
}

/**
 * Temperature to color for heatmap.
 */
export function tempToColor(temp: number): string {
    if (temp <= -20) return '#1e3a5f';
    if (temp <= -10) return '#2563eb';
    if (temp <= 0) return '#3b82f6';
    if (temp <= 10) return '#06b6d4';
    if (temp <= 20) return '#22c55e';
    if (temp <= 30) return '#eab308';
    if (temp <= 40) return '#f97316';
    return '#ef4444';
}

/**
 * Capitalize first letter of each word.
 */
export function capitalize(str: string): string {
    return str
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

/**
 * Debounce function.
 */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
    let timer: NodeJS.Timeout;
    return ((...args: unknown[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    }) as T;
}
