'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="contact" className="section-padding relative" ref={ref}>
            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    className="relative rounded-3xl overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-bg-secondary to-accent-primary/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 to-transparent" />

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 grid-bg opacity-30" />

                    {/* Floating orbs */}
                    <motion.div
                        className="absolute top-10 right-16 w-32 h-32 rounded-full bg-accent-primary/10 blur-2xl"
                        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-10 left-16 w-48 h-48 rounded-full bg-accent-primary/[0.07] blur-3xl"
                        animate={{ y: [0, 15, 0], scale: [1, 0.95, 1] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Content */}
                    <div className="relative z-10 px-8 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-28 text-center">
                        <motion.span
                            className="inline-block text-xs font-medium text-accent-primary uppercase tracking-[0.2em] mb-4"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.2 }}
                        >
                            Get Started Today
                        </motion.span>

                        <motion.h2
                            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-text-primary mb-6 max-w-3xl mx-auto leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            Ready to Build the{' '}
                            <span className="gradient-text-accent">Future</span>?
                        </motion.h2>

                        <motion.p
                            className="text-text-secondary text-lg max-w-xl mx-auto mb-10"
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            Join thousands of teams shipping faster with AeroSphere.
                            Start free, no credit card required.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap justify-center gap-4"
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.7, duration: 0.6 }}
                        >
                            <motion.a
                                href="#"
                                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent-primary hover:bg-red-700 text-white font-medium text-lg transition-all shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Building
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-text-muted/30 text-text-secondary hover:text-text-primary hover:border-text-secondary/50 transition-all text-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Schedule Demo
                            </motion.a>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
