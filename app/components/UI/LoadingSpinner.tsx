'use client';

/**
 * LoadingSpinner - Animated loading state component.
 */
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-20 h-20',
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Outer ring */}
            <div className="relative">
                <motion.div
                    className={`${sizes[size]} rounded-full border-2 border-cyan-500/20`}
                    style={{ borderTopColor: 'rgb(6 182 212)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                {/* Inner pulse */}
                <motion.div
                    className="absolute inset-2 rounded-full bg-cyan-500/20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {text && (
                <motion.p
                    className="text-sm text-gray-400 font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {text}
                </motion.p>
            )}
        </motion.div>
    );
}
