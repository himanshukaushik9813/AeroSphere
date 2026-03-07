'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navLinks = [
    { label: 'Dashboard', href: '#dashboard', icon: '◈' },
    { label: 'Weather Map', href: '#globe', icon: '◎' },
    { label: 'Forecast', href: '#forecast', icon: '◇' },
    { label: 'Climate Insights', href: '#climate', icon: '◆' },
    { label: 'Alerts', href: '#alerts', icon: '⚠' },
];

interface DashboardNavbarProps {
    connected: boolean;
    lastUpdate: number | null;
    onLocateMe: () => void;
    locating: boolean;
}

export default function DashboardNavbar({ connected, lastUpdate, onLocateMe, locating }: DashboardNavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('#dashboard');
    const [time, setTime] = useState('');
    const lastUpdateLabel = lastUpdate
        ? new Date(lastUpdate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
        : null;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Live clock
    useEffect(() => {
        const update = () => {
            setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-bg-primary/85 backdrop-blur-2xl border-b border-white/[0.04] shadow-2xl shadow-black/40'
                    : 'bg-transparent'
                    }`}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
                <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-[68px]">
                        {/* Logo */}
                        <motion.a
                            href="#dashboard"
                            className="flex items-center gap-3 group"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-accent-primary/20 group-hover:shadow-accent-primary/40 transition-all duration-300">
                                <Image src="/logo.png" alt="AeroSphere" fill className="object-cover" sizes="40px" />
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent-primary/10" />
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-xl font-display font-bold text-text-primary tracking-tight leading-tight">
                                    Aero<span className="gradient-text-accent">Sphere</span>
                                </span>
                                <span className="text-[9px] text-text-muted uppercase tracking-[0.2em] font-mono leading-none">
                                    Weather Intelligence
                                </span>
                            </div>
                        </motion.a>

                        {/* Desktop nav */}
                        <div className="hidden lg:flex items-center gap-1 bg-white/[0.02] rounded-xl px-2 py-1.5 border border-white/[0.04]">
                            {navLinks.map((link) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeLink === link.href
                                        ? 'text-text-primary bg-white/[0.06]'
                                        : 'text-text-muted hover:text-text-secondary'
                                        }`}
                                    whileHover={{ y: -1, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveLink(link.href)}
                                >
                                    <span className={`text-[11px] ${activeLink === link.href ? 'text-accent-primary' : 'text-accent-primary/40'}`}>
                                        {link.icon}
                                    </span>
                                    <span className="font-medium">{link.label}</span>
                                    {activeLink === link.href && (
                                        <motion.div
                                            className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent-primary rounded-full"
                                            layoutId="navActiveBar"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </motion.a>
                            ))}
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            {/* Live clock */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                <span className="text-[11px] text-accent-primary font-mono font-bold tracking-wider">{time}</span>
                            </div>

                            {/* Status */}
                            <motion.div
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                                animate={connected ? {} : { borderColor: ['rgba(239,68,68,0.1)', 'rgba(239,68,68,0.3)', 'rgba(239,68,68,0.1)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <motion.div
                                    className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-[11px] text-text-muted font-mono uppercase tracking-wider font-medium">
                                    {connected ? 'Live' : 'Offline'}
                                </span>
                                {lastUpdateLabel && (
                                    <span className="text-[11px] text-text-muted/70 font-mono">
                                        {lastUpdateLabel}
                                    </span>
                                )}
                            </motion.div>

                            {/* My Location button */}
                            <motion.button
                                onClick={onLocateMe}
                                disabled={locating}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all interactive-btn ${locating
                                        ? 'bg-accent-primary/10 border border-accent-primary/30 text-accent-primary'
                                        : 'bg-white/[0.04] border border-white/[0.06] text-text-muted hover:text-text-primary hover:border-accent-primary/30 hover:bg-accent-primary/5'
                                    }`}
                                whileHover={locating ? {} : { scale: 1.05, y: -1 }}
                                whileTap={locating ? {} : { scale: 0.95 }}
                            >
                                {locating ? (
                                    <motion.div
                                        className="w-4 h-4 rounded-full border-2 border-accent-primary/30 border-t-accent-primary"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                    />
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                                    </svg>
                                )}
                                <span className="hidden sm:inline">{locating ? 'Locating...' : 'My Location'}</span>
                            </motion.button>

                            {/* Search toggle */}
                            <motion.button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-text-muted hover:text-text-primary hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all"
                                whileHover={{ scale: 1.08, rotate: 5 }}
                                whileTap={{ scale: 0.92 }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </motion.button>

                            {/* User profile */}
                            <motion.div
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/10 border border-white/[0.08] flex items-center justify-center text-text-muted cursor-pointer hover:border-accent-primary/30 transition-all"
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </motion.div>

                            {/* Mobile toggle */}
                            <button
                                className="lg:hidden flex flex-col gap-1.5 p-2"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                            >
                                <motion.span className="w-5 h-0.5 bg-text-primary block rounded-full" animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} />
                                <motion.span className="w-5 h-0.5 bg-text-primary block rounded-full" animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }} transition={{ duration: 0.2 }} />
                                <motion.span className="w-5 h-0.5 bg-text-primary block rounded-full" animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expandable search */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            className="px-4 lg:px-8 pb-4"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="max-w-lg mx-auto relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search cities, coordinates, weather data..."
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[15px] text-text-primary placeholder:text-text-muted/70 focus:outline-none focus:border-accent-primary/30 focus:bg-white/[0.06] transition-all"
                                    autoFocus
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setMobileOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <motion.div
                            className="absolute top-[72px] right-3 left-3 bg-bg-secondary/95 backdrop-blur-2xl rounded-2xl border border-white/[0.06] p-6 shadow-2xl shadow-black/40"
                            initial={{ opacity: 0, y: -20, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.92 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center gap-4 py-4 text-lg text-text-secondary hover:text-text-primary border-b border-white/[0.04] last:border-0 transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span className="text-accent-primary text-sm">{link.icon}</span>
                                    <span className="font-medium">{link.label}</span>
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
