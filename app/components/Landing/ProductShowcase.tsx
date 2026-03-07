'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const showcaseItems = [
    {
        title: 'Real-Time Dashboard',
        description: 'Monitor your entire infrastructure with live metrics, custom alerts, and team collaboration tools. Drill down into any service with one click.',
        features: ['Live Metrics', 'Custom Alerts', 'Team Collaboration'],
        gradient: 'from-accent-primary/20 to-accent-primary/5',
    },
    {
        title: 'Intelligent Deployment',
        description: 'Push code to production with automated CI/CD pipelines, blue-green deployments, and instant rollbacks — zero downtime guaranteed.',
        features: ['CI/CD Pipeline', 'Blue-Green Deploy', 'Instant Rollback'],
        gradient: 'from-accent-tertiary/15 to-accent-tertiary/5',
    },
    {
        title: 'Cost Optimization Engine',
        description: 'AI analyzes your usage patterns to rightsize resources, reserve capacity, and eliminate waste — saving teams an average of 40% on cloud spend.',
        features: ['Usage Analysis', 'Auto-Rightsizing', '40% Avg Savings'],
        gradient: 'from-accent-primary/15 to-accent-secondary/10',
    },
];

export default function ProductShowcase() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    return (
        <section id="showcase" className="section-padding relative" ref={containerRef}>
            {/* Background effect */}
            <div className="absolute right-0 top-1/3 w-[500px] h-[500px] rounded-full bg-accent-primary/[0.03] blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-block text-xs font-medium text-accent-primary uppercase tracking-[0.2em] mb-4">
                        Solutions
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6">
                        Built for{' '}
                        <span className="gradient-text-accent">Modern Teams</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        From solo developers to enterprise organizations — AeroSphere scales with your ambitions.
                    </p>
                </motion.div>

                {/* Showcase cards */}
                <div className="space-y-20">
                    {showcaseItems.map((item, i) => (
                        <ShowcaseCard key={item.title} item={item} index={i} reverse={i % 2 !== 0} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ShowcaseCard({
    item,
    index,
    reverse,
}: {
    item: typeof showcaseItems[0];
    index: number;
    reverse: boolean;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

    return (
        <motion.div
            ref={ref}
            className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${reverse ? 'lg:direction-rtl' : ''}`}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
            {/* Visual Card */}
            <motion.div
                className={`relative ${reverse ? 'lg:order-2 lg:direction-ltr' : ''}`}
                style={{ y }}
            >
                <div className={`rounded-2xl aspect-[4/3] bg-gradient-to-br ${item.gradient} border border-white/[0.05] overflow-hidden relative group`}>
                    {/* Mock UI inside card */}
                    <div className="absolute inset-4 sm:inset-6 rounded-xl bg-bg-primary/60 backdrop-blur-sm border border-white/[0.04] p-4 sm:p-6">
                        {/* Fake title bar */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-accent-primary/60" />
                            <div className="w-3 h-3 rounded-full bg-accent-secondary/40" />
                            <div className="w-3 h-3 rounded-full bg-accent-tertiary/30" />
                            <div className="ml-4 h-2 w-32 bg-white/[0.06] rounded-full" />
                        </div>
                        {/* Fake content lines */}
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-white/[0.04] rounded-full" />
                            <div className="h-2 w-4/5 bg-white/[0.04] rounded-full" />
                            <div className="h-2 w-3/5 bg-white/[0.04] rounded-full" />
                            <div className="mt-6 grid grid-cols-3 gap-3">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="h-16 rounded-lg bg-white/[0.03] border border-white/[0.04]" />
                                ))}
                            </div>
                            <div className="mt-4 h-24 rounded-lg bg-gradient-to-r from-accent-primary/10 to-transparent border border-accent-primary/10" />
                        </div>
                    </div>

                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </motion.div>

            {/* Text content */}
            <div className={`${reverse ? 'lg:order-1 lg:direction-ltr' : ''}`}>
                <span className="inline-block text-xs text-accent-primary font-medium uppercase tracking-wider mb-3">
                    0{index + 1}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mb-4">
                    {item.title}
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                    {item.description}
                </p>
                <div className="flex flex-wrap gap-3">
                    {item.features.map((f) => (
                        <span
                            key={f}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-text-secondary"
                        >
                            {f}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
