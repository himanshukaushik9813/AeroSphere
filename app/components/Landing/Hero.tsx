'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Primary glow */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-accent-primary/[0.07] blur-[120px] animate-glow-pulse" />
                {/* Secondary glow */}
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-tertiary/[0.04] blur-[100px]" />
                {/* Grid background */}
                <div className="absolute inset-0 grid-bg opacity-40" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-primary/20 bg-accent-primary/[0.06] mb-8"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                            <span className="text-xs font-medium text-accent-primary tracking-wide uppercase">
                                Now in Public Beta
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <span className="text-text-primary">The Future of</span>
                            <br />
                            <span className="gradient-text-accent">Cloud Infrastructure</span>
                            <br />
                            <span className="text-text-primary">Starts Here</span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            className="text-lg sm:text-xl text-text-secondary max-w-lg mb-10 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                        >
                            Deploy, scale, and monitor your applications with AI-powered analytics
                            and enterprise-grade security — all from a single unified platform.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                        >
                            <motion.a
                                href="#features"
                                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent-primary hover:bg-red-700 text-white font-medium transition-all shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Explore Platform
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#showcase"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-text-muted/30 text-text-secondary hover:text-text-primary hover:border-text-secondary/50 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Learn More
                            </motion.a>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            className="mt-14 flex items-center gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            <p className="text-xs text-text-muted uppercase tracking-wider">Trusted by</p>
                            <div className="flex items-center gap-5">
                                {['NASA', 'SpaceX', 'Tesla', 'MIT'].map((name) => (
                                    <span key={name} className="text-sm font-display font-semibold text-text-muted/60 hover:text-text-secondary transition-colors">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Abstract Illustration */}
                    <motion.div
                        className="hidden lg:flex items-center justify-center relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="relative w-[500px] h-[500px]">
                            {/* Outer orbit ring */}
                            <div className="absolute inset-0 rounded-full border border-accent-tertiary/10 animate-orbit-slow" />

                            {/* Middle orbit ring */}
                            <div className="absolute inset-8 rounded-full border border-accent-primary/15 animate-orbit-reverse" />

                            {/* Inner orbit ring */}
                            <div className="absolute inset-20 rounded-full border border-text-muted/10 animate-orbit" />

                            {/* Central sphere */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-48 h-48 rounded-full relative"
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    {/* Sphere gradient */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-primary/30 via-bg-secondary to-accent-primary/10 shadow-2xl shadow-accent-primary/20" />
                                    {/* Sphere highlight */}
                                    <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.1]" />
                                    {/* Inner glow */}
                                    <div className="absolute inset-0 rounded-full bg-accent-primary/5 blur-xl" />
                                </motion.div>
                            </div>

                            {/* Floating nodes */}
                            {[
                                { x: '10%', y: '20%', delay: 0, size: 12 },
                                { x: '85%', y: '30%', delay: 1, size: 8 },
                                { x: '75%', y: '75%', delay: 2, size: 10 },
                                { x: '15%', y: '70%', delay: 0.5, size: 6 },
                                { x: '50%', y: '5%', delay: 1.5, size: 8 },
                                { x: '45%', y: '90%', delay: 2.5, size: 6 },
                            ].map((node, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full bg-accent-primary"
                                    style={{
                                        left: node.x,
                                        top: node.y,
                                        width: node.size,
                                        height: node.size,
                                    }}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.4, 0.8, 0.4],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: node.delay,
                                    }}
                                />
                            ))}

                            {/* Connecting lines (decorative SVG) */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500" fill="none">
                                <line x1="55" y1="105" x2="250" y2="250" stroke="rgba(179,12,11,0.15)" strokeWidth="1" />
                                <line x1="425" y1="155" x2="250" y2="250" stroke="rgba(180,183,203,0.08)" strokeWidth="1" />
                                <line x1="375" y1="380" x2="250" y2="250" stroke="rgba(179,12,11,0.1)" strokeWidth="1" />
                                <line x1="80" y1="355" x2="250" y2="250" stroke="rgba(180,183,203,0.06)" strokeWidth="1" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-1.5">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-accent-primary"
                        animate={{ y: [0, 16, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
