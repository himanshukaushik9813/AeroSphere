'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

const testimonials = [
    {
        quote: "AeroSphere transformed our deployment pipeline. What used to take hours now happens in seconds. The real-time analytics alone saved us thousands in operational costs.",
        name: 'Sarah Chen',
        role: 'CTO, NeuralWave AI',
        avatar: 'SC',
        color: 'from-accent-primary to-red-700',
    },
    {
        quote: "The intelligent auto-scaling is remarkable. We handled a 10x traffic spike during our product launch without any manual intervention. Truly enterprise-grade.",
        name: 'Marcus Rodriguez',
        role: 'Lead DevOps Engineer, Stratify',
        avatar: 'MR',
        color: 'from-accent-tertiary to-accent-secondary',
    },
    {
        quote: "Migrating from AWS to AeroSphere cut our cloud bill by 42%. The cost optimization engine identified waste we didn't even know existed.",
        name: 'Priya Sharma',
        role: 'VP Engineering, DataFlow',
        avatar: 'PS',
        color: 'from-accent-primary/80 to-accent-tertiary',
    },
    {
        quote: "We evaluated every major cloud platform. AeroSphere's developer experience is in a completely different league — the API design is exceptional.",
        name: 'James Park',
        role: 'Staff Engineer, Quantum Labs',
        avatar: 'JP',
        color: 'from-accent-secondary to-accent-tertiary/80',
    },
];

export default function Testimonials() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section className="section-padding relative" ref={ref}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-primary/[0.03] blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-block text-xs font-medium text-accent-primary uppercase tracking-[0.2em] mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary">
                        What Our <span className="gradient-text-accent">Customers</span> Say
                    </h2>
                </motion.div>

                {/* Carousel */}
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.7 }}
                >
                    <div className="relative">
                        {/* Main Card */}
                        <div className="glass-card rounded-2xl p-8 sm:p-12 min-h-[280px] flex flex-col justify-between">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* Quote icon */}
                                    <svg className="w-10 h-10 text-accent-primary/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>

                                    {/* Quote text */}
                                    <p className="text-lg sm:text-xl text-text-primary leading-relaxed mb-8 font-light">
                                        &ldquo;{testimonials[current].quote}&rdquo;
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[current].color} flex items-center justify-center text-white font-bold text-sm`}>
                                            {testimonials[current].avatar}
                                        </div>
                                        <div>
                                            <p className="font-display font-semibold text-text-primary">
                                                {testimonials[current].name}
                                            </p>
                                            <p className="text-sm text-text-secondary">
                                                {testimonials[current].role}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <button
                                onClick={prev}
                                className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-all"
                                aria-label="Previous testimonial"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>

                            {/* Dots */}
                            <div className="flex items-center gap-2">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current
                                                ? 'w-6 bg-accent-primary'
                                                : 'bg-text-muted/30 hover:bg-text-muted/50'
                                            }`}
                                        aria-label={`Go to testimonial ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={next}
                                className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-all"
                                aria-label="Next testimonial"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
