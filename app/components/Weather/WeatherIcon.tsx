'use client';

/**
 * WeatherIcon - Maps weather condition codes to visual representation.
 * Uses OpenWeatherMap icon URLs with a fallback.
 */
import Image from 'next/image';

interface WeatherIconProps {
    icon: string;
    condition: string;
    size?: number;
    className?: string;
}

export default function WeatherIcon({ icon, condition, size = 64, className = '' }: WeatherIconProps) {
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            {/* Glow behind icon */}
            <div
                className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{
                    background: getConditionGlow(condition),
                }}
            />
            <Image
                src={iconUrl}
                alt={condition}
                width={size}
                height={size}
                className="relative z-10 drop-shadow-lg"
                unoptimized
            />
        </div>
    );
}

function getConditionGlow(condition: string): string {
    switch (condition?.toLowerCase()) {
        case 'clear':
            return 'radial-gradient(circle, rgba(250, 204, 21, 0.4), transparent)';
        case 'clouds':
            return 'radial-gradient(circle, rgba(148, 163, 184, 0.3), transparent)';
        case 'rain':
        case 'drizzle':
            return 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)';
        case 'thunderstorm':
            return 'radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent)';
        case 'snow':
            return 'radial-gradient(circle, rgba(226, 232, 240, 0.4), transparent)';
        case 'mist':
        case 'haze':
        case 'fog':
            return 'radial-gradient(circle, rgba(203, 213, 225, 0.3), transparent)';
        default:
            return 'radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent)';
    }
}
