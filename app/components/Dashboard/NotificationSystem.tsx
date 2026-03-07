'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AlertsData } from '../../types/weather';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'storm' | 'extreme' | 'warning' | 'info';
    timestamp: number;
}

interface NotificationSystemProps {
    alerts: AlertsData | null;
}

const typeStyles = {
    storm: { bg: 'bg-orange-500/[0.06]', border: 'border-orange-500/15', dot: 'bg-orange-500', icon: '⚡', label: 'Storm Alert' },
    extreme: { bg: 'bg-red-500/[0.06]', border: 'border-red-500/15', dot: 'bg-red-500', icon: '🔴', label: 'Extreme' },
    warning: { bg: 'bg-yellow-500/[0.06]', border: 'border-yellow-500/15', dot: 'bg-yellow-500', icon: '⚠️', label: 'Warning' },
    info: { bg: 'bg-blue-500/[0.06]', border: 'border-blue-500/15', dot: 'bg-blue-500', icon: 'ℹ️', label: 'Info' },
};

export default function NotificationSystem({ alerts }: NotificationSystemProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!alerts?.hasAlerts) return;

        const newNotifs: Notification[] = alerts.alerts.map((alert, i) => ({
            id: `alert-${alert.type}-${i}-${Date.now()}`,
            title: alert.title,
            message: alert.description.slice(0, 120) + (alert.description.length > 120 ? '...' : ''),
            type: alert.severity === 'extreme' ? 'extreme' : 'storm',
            timestamp: Date.now(),
        }));

        setNotifications((prev) => {
            const existingTitles = new Set(prev.map((n) => n.title));
            const unique = newNotifs.filter((n) => !existingTitles.has(n.title));
            return [...unique, ...prev].slice(0, 5);
        });
    }, [alerts]);

    const dismiss = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    useEffect(() => {
        if (notifications.length === 0) return;
        const timer = setInterval(() => {
            setNotifications((prev) => {
                const now = Date.now();
                return prev.filter((n) => now - n.timestamp < 12000);
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [notifications]);

    return (
        <div className="fixed top-20 right-4 lg:right-6 z-40 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            <AnimatePresence>
                {notifications.map((notif) => {
                    const style = typeStyles[notif.type];

                    return (
                        <motion.div
                            key={notif.id}
                            className={`${style.bg} border ${style.border} backdrop-blur-2xl rounded-2xl p-5 shadow-2xl shadow-black/30 pointer-events-auto`}
                            initial={{ opacity: 0, x: 120, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            layout
                        >
                            <div className="flex items-start gap-3">
                                <motion.span
                                    className="text-xl flex-shrink-0 mt-0.5"
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 1.5, repeat: 2 }}
                                >
                                    {style.icon}
                                </motion.span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted">{style.label}</span>
                                        </div>
                                        <motion.button
                                            onClick={() => dismiss(notif.id)}
                                            className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/[0.1] transition-all"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                    <h4 className="text-sm font-display font-bold text-text-primary leading-snug truncate">
                                        {notif.title}
                                    </h4>
                                    <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 h-[3px] rounded-full bg-white/[0.04] overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${style.dot}`}
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: 12, ease: 'linear' }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
