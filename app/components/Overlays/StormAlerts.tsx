'use client';

/**
 * StormAlerts - Extreme weather alert display.
 */
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import type { AlertsData } from '../../types/weather';

interface StormAlertsProps {
    alerts: AlertsData;
}

export default function StormAlerts({ alerts }: StormAlertsProps) {
    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'extreme':
                return {
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/30',
                    text: 'text-red-400',
                    icon: '🔴',
                    badge: 'bg-red-500/20 text-red-300',
                };
            case 'severe':
                return {
                    bg: 'bg-orange-500/10',
                    border: 'border-orange-500/30',
                    text: 'text-orange-400',
                    icon: '🟠',
                    badge: 'bg-orange-500/20 text-orange-300',
                };
            default:
                return {
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/30',
                    text: 'text-yellow-400',
                    icon: '🟡',
                    badge: 'bg-yellow-500/20 text-yellow-300',
                };
        }
    };

    return (
        <GlassCard className="p-5" delay={0.3}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                Storm Alerts
                {alerts.hasAlerts && (
                    <motion.span
                        className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {alerts.alerts.length} Active
                    </motion.span>
                )}
            </h3>

            <AnimatePresence>
                {alerts.hasAlerts ? (
                    <div className="space-y-3">
                        {alerts.alerts.map((alert, idx) => {
                            const styles = getSeverityStyles(alert.severity);
                            return (
                                <motion.div
                                    key={`${alert.type}-${idx}`}
                                    className={`${styles.bg} ${styles.border} border rounded-xl p-4`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: 0.1 * idx }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl mt-0.5">{styles.icon}</span>
                                        <div>
                                            <p className={`font-semibold ${styles.text}`}>{alert.title}</p>
                                            <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                                            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${styles.badge}`}>
                                                {alert.severity.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div
                        className="text-center py-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span className="text-3xl mb-3 block">✅</span>
                        <p className="text-gray-400 text-sm">No active weather alerts</p>
                        <p className="text-gray-500 text-xs mt-1">Conditions are normal for {alerts.location}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}
