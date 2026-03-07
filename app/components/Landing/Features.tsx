'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
        title: 'Scalable Architecture',
        description: 'Auto-scale from zero to millions of requests. Our distributed infrastructure adapts in real-time to your workload demands.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
        ),
        title: 'Enterprise Security',
        description: 'SOC 2 Type II certified with end-to-end encryption, zero-trust architecture, and automated threat detection built in.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
        title: 'AI-Powered Analytics',
        description: 'Get actionable insights with machine learning models that predict usage patterns, detect anomalies, and optimize costs.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
        ),
        title: 'Global Edge Network',
        description: 'Deploy to 200+ edge locations worldwide. Sub-10ms latency with intelligent routing and automatic failover.',
    },
];

export default function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="features" className="section-padding relative" ref={ref}>
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent-primary/[0.03] blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <motion.span
                        className="inline-block text-xs font-medium text-accent-primary uppercase tracking-[0.2em] mb-4"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        Features
                    </motion.span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6">
                        Everything You Need to{' '}
                        <span className="gradient-text-accent">Ship Faster</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        A complete platform engineered for modern teams who demand performance,
                        security, and simplicity at scale.
                    </p>
                </motion.div>

                {/* Feature cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            className="glass-card rounded-2xl p-7 group cursor-default"
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.1 * i + 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-5 group-hover:bg-accent-primary/15 group-hover:border-accent-primary/30 transition-all">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-display font-semibold text-text-primary mb-3">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover accent line */}
                            <div className="mt-5 w-0 h-[2px] bg-accent-primary group-hover:w-12 transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
