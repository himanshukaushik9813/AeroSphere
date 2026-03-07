'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Products', href: '#features' },
    { label: 'Solutions', href: '#showcase' },
    { label: 'About', href: '#stats' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                        ? 'bg-bg-primary/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-lg shadow-black/20'
                        : 'bg-transparent'
                    }`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <motion.a
                            href="#home"
                            className="flex items-center gap-3 group"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-red-700 flex items-center justify-center shadow-lg shadow-accent-primary/20 group-hover:shadow-accent-primary/40 transition-shadow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                                    <line x1="12" y1="22" x2="12" y2="15.5" />
                                    <polyline points="22 8.5 12 15.5 2 8.5" />
                                </svg>
                            </div>
                            <span className="text-xl font-display font-bold text-text-primary tracking-tight">
                                Aero<span className="text-accent-primary">Sphere</span>
                            </span>
                        </motion.a>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm text-text-secondary hover:text-text-primary transition-colors relative group"
                                    whileHover={{ y: -1 }}
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent-primary group-hover:w-full transition-all duration-300" />
                                </motion.a>
                            ))}
                        </div>

                        {/* CTA + Mobile Toggle */}
                        <div className="flex items-center gap-4">
                            <motion.a
                                href="#contact"
                                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary hover:bg-red-700 text-white text-sm font-medium transition-all shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Started
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </motion.a>

                            {/* Mobile hamburger */}
                            <button
                                className="md:hidden flex flex-col gap-1.5 p-2"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                            >
                                <motion.span
                                    className="w-6 h-0.5 bg-text-primary block"
                                    animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                />
                                <motion.span
                                    className="w-6 h-0.5 bg-text-primary block"
                                    animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                                />
                                <motion.span
                                    className="w-6 h-0.5 bg-text-primary block"
                                    animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                        <motion.div
                            className="absolute top-20 right-4 left-4 bg-bg-secondary/95 backdrop-blur-2xl rounded-2xl border border-white/[0.05] p-6 shadow-2xl"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.label}
                                        href={link.href}
                                        className="text-lg text-text-secondary hover:text-text-primary transition-colors py-2 border-b border-white/[0.05]"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                                <motion.a
                                    href="#contact"
                                    className="mt-2 w-full text-center px-5 py-3 rounded-full bg-accent-primary text-white font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Get Started
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
