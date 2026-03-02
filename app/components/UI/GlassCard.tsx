'use client';

/**
 * GlassCard - Reusable glassmorphism container component.
 */
import { motion } from 'framer-motion';
import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
    delay?: number;
    onClick?: () => void;
}

export default function GlassCard({
    children,
    className = '',
    animate = true,
    delay = 0,
    onClick,
}: GlassCardProps) {
    const baseClasses =
        'relative backdrop-blur-xl bg-slate-900/55 border border-slate-400/20 rounded-2xl shadow-2xl overflow-hidden';

    if (!animate) {
        return (
            <div className={`${baseClasses} ${className}`} onClick={onClick}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/[0.08] via-transparent to-amber-300/[0.05] pointer-events-none" />
                <div className="relative z-10">{children}</div>
            </div>
        );
    }

    return (
        <motion.div
            className={`${baseClasses} ${className}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
            whileHover={onClick ? { scale: 1.02, borderColor: 'rgba(45, 212, 191, 0.4)' } : undefined}
            onClick={onClick}
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/[0.08] via-transparent to-amber-300/[0.05] pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
