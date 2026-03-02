'use client';

/**
 * RainPrediction - AI rain prediction display with animated gauge.
 */
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import type { RainPrediction as RainPredictionType } from '../../types/weather';

interface RainPredictionProps {
    prediction: RainPredictionType;
}

export default function RainPrediction({ prediction }: RainPredictionProps) {
    const getIntensityColor = (intensity: string) => {
        switch (intensity) {
            case 'heavy': return '#ef4444';
            case 'moderate': return '#f97316';
            case 'light': return '#facc15';
            case 'drizzle': return '#3b82f6';
            default: return '#22c55e';
        }
    };

    const color = getIntensityColor(prediction.intensity);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (prediction.probability / 100) * circumference;

    return (
        <GlassCard className="p-5" delay={0.4}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-lg">🤖</span>
                AI Rain Prediction
            </h3>

            <div className="flex items-center gap-6">
                {/* Circular gauge */}
                <div className="relative w-28 h-28 flex-shrink-0">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="6"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke={color}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                        />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            className="text-2xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {prediction.probability}%
                        </motion.span>
                        <span className="text-xs text-gray-500">chance</span>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                    <p
                        className="text-lg font-semibold capitalize mb-1"
                        style={{ color }}
                    >
                        {prediction.intensity === 'none' ? 'No Rain' : `${prediction.intensity} Rain`}
                    </p>
                    <p className="text-sm text-gray-400 mb-3">{prediction.description}</p>

                    <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-gray-400">
                            Confidence: {prediction.confidence}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-gray-400">
                            🧠 AI Model
                        </span>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
