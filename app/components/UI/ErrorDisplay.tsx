'use client';

/**
 * ErrorDisplay - Error state with retry button.
 */
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
    return (
        <motion.div
            className="flex flex-col items-center justify-center gap-4 p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Error icon */}
            <motion.div
                className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </motion.div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-1">Something went wrong</h3>
                <p className="text-sm text-gray-400 max-w-sm">{message}</p>
            </div>

            {onRetry && (
                <motion.button
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 rounded-xl text-sm font-medium text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRetry}
                >
                    Try Again
                </motion.button>
            )}
        </motion.div>
    );
}
