'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
    { value: 50000, suffix: '+', label: 'Active Users', prefix: '' },
    { value: 12, suffix: 'M+', label: 'Transactions / Day', prefix: '' },
    { value: 200, suffix: '+', label: 'Integrations', prefix: '' },
    { value: 99.99, suffix: '%', label: 'Uptime SLA', prefix: '' },
];

function useCountUp(target: number, isInView: boolean, duration: number = 2000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const startTime = performance.now();
        const isFloat = target % 1 !== 0;

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            setCount(isFloat ? parseFloat(current.toFixed(2)) : Math.floor(current));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }, [isInView, target, duration]);

    return count;
}

export default function Stats() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="stats" className="section-padding relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-primary/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto" ref={ref}>
                <motion.div
                    className="rounded-3xl glass-strong p-8 sm:p-12 lg:p-16 relative overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    {/* Decorative gradient border effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent-primary/20 via-transparent to-accent-primary/10 opacity-[0.15] pointer-events-none" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/[0.05] blur-[100px] rounded-full pointer-events-none" />

                    {/* Section header */}
                    <motion.div
                        className="text-center mb-12 lg:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <span className="inline-block text-xs font-medium text-accent-primary uppercase tracking-[0.2em] mb-4">
                            By The Numbers
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
                            Trusted at <span className="gradient-text-accent">Scale</span>
                        </h2>
                    </motion.div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((stat, i) => (
                            <StatItem key={stat.label} stat={stat} index={i} isInView={isInView} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function StatItem({
    stat,
    index,
    isInView,
}: {
    stat: typeof stats[0];
    index: number;
    isInView: boolean;
}) {
    const count = useCountUp(stat.value, isInView);

    return (
        <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 * index + 0.4, duration: 0.6 }}
        >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-2">
                {stat.prefix}
                {stat.value % 1 !== 0 ? count.toFixed(2) : count.toLocaleString()}
                <span className="text-accent-primary">{stat.suffix}</span>
            </div>
            <p className="text-sm text-text-secondary">{stat.label}</p>
        </motion.div>
    );
}
