'use client';

import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import type { CurrentWeather } from '../../types/weather';

interface WeatherInsightsProps {
  weather: CurrentWeather;
}

function formatTimeWithOffset(unixSeconds: number, offsetSeconds: number): string {
  const date = new Date((unixSeconds + offsetSeconds) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}

function computeComfortScore(temp: number, humidity: number, windSpeed: number): number {
  const tempPenalty = Math.abs(temp - 22) * 2.2;
  const humidityPenalty = Math.abs(humidity - 50) * 0.65;
  const windPenalty = Math.max(0, windSpeed - 7) * 3.8;
  return Math.max(0, Math.min(100, Math.round(100 - tempPenalty - humidityPenalty - windPenalty)));
}

function comfortLabel(score: number): string {
  if (score >= 82) return 'Excellent';
  if (score >= 65) return 'Comfortable';
  if (score >= 45) return 'Mixed';
  return 'Challenging';
}

function visibilityLabel(visibilityMeters: number): string {
  const km = visibilityMeters / 1000;
  if (km >= 10) return 'Crystal Clear';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  return 'Low Visibility';
}

export default function WeatherInsights({ weather }: WeatherInsightsProps) {
  const comfort = computeComfortScore(weather.temperature, weather.humidity, weather.windSpeed);
  const sunrise = formatTimeWithOffset(weather.sunrise, weather.timezone);
  const sunset = formatTimeWithOffset(weather.sunset, weather.timezone);
  const localNow = formatTimeWithOffset(Math.floor(Date.now() / 1000), weather.timezone);
  const daylightHours = ((weather.sunset - weather.sunrise) / 3600).toFixed(1);

  const metrics = [
    {
      title: 'Local Time',
      value: localNow,
      sub: `${weather.location}`,
      accent: 'from-cyan-400/40 to-blue-400/10',
    },
    {
      title: 'Sun Cycle',
      value: `${sunrise} → ${sunset}`,
      sub: `${daylightHours}h daylight`,
      accent: 'from-amber-400/40 to-orange-400/10',
    },
    {
      title: 'Comfort Score',
      value: `${comfort}/100`,
      sub: comfortLabel(comfort),
      accent: 'from-emerald-400/40 to-teal-400/10',
    },
    {
      title: 'Visibility Quality',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      sub: visibilityLabel(weather.visibility),
      accent: 'from-indigo-400/40 to-sky-400/10',
    },
  ];

  return (
    <GlassCard className="p-5" delay={0.05}>
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-cyan-300">✨</span>
        Live Insights
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.title}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/45 px-4 py-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * idx + 0.15 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.accent} pointer-events-none`} />
            <div className="relative z-10">
              <p className="text-[11px] uppercase tracking-widest text-slate-400">{metric.title}</p>
              <p className="mt-1 text-sm font-semibold text-white">{metric.value}</p>
              <p className="text-xs text-slate-300/80 mt-1">{metric.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
