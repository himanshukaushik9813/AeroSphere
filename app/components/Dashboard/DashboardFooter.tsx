'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface DashboardFooterProps {
    connected: boolean;
}

const footerLinks = [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Weather Map', href: '#globe' },
    { label: 'Forecast', href: '#forecast' },
    { label: 'Climate Insights', href: '#climate' },
];

export default function DashboardFooter({ connected }: DashboardFooterProps) {
    return (
        <footer className="relative border-t border-white/[0.04] mt-12">
            {/* Top gradient line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />

            <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Left: Logo + description */}
                    <div>
                        <motion.div
                            className="flex items-center gap-3 mb-3"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                                <Image src="/logo.png" alt="AeroSphere" fill className="object-cover" sizes="40px" />
                            </div>
                            <div>
                                <span className="text-lg font-display font-bold text-text-primary">
                                    Aero<span className="gradient-text-accent">Sphere</span>
                                </span>
                            </div>
                        </motion.div>
                        <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                            Real-time weather intelligence and climate monitoring dashboard powered by satellite data and AI.
                        </p>
                    </div>

                    {/* Center: Quick links */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {footerLinks.map((link) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                className="text-sm text-text-muted hover:text-text-primary transition-colors"
                                whileHover={{ y: -2 }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                        <motion.a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
                            whileHover={{ y: -2 }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </motion.a>
                    </div>

                    {/* Right: Status + credits */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        {/* Connection status */}
                        <motion.div
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                            animate={connected ? {} : { borderColor: ['rgba(239,68,68,0.05)', 'rgba(239,68,68,0.2)', 'rgba(239,68,68,0.05)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <motion.div
                                className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-xs text-text-muted font-mono">
                                API {connected ? 'Connected' : 'Disconnected'}
                            </span>
                        </motion.div>

                        <div className="text-xs text-text-muted/60 text-center md:text-right">
                            Powered by OpenWeatherMap API
                        </div>

                        <motion.div
                            className="inline-flex items-center gap-2 rounded-full border border-accent-primary/15 bg-accent-primary/[0.04] px-4 py-1.5"
                            whileHover={{ scale: 1.03, borderColor: 'rgba(179,12,11,0.3)' }}
                        >
                            <span className="text-[9px] uppercase tracking-[0.15em] text-text-muted font-mono">Built by</span>
                            <span className="text-[12px] font-display font-bold text-text-primary">Himanshu Kaushik</span>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.03] text-center">
                    <p className="text-[11px] text-text-muted/40 font-mono">
                        © 2026 AeroSphere — Real-time Weather Intelligence Dashboard. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
