'use client';

import { motion } from 'framer-motion';

const TICKER_WORDS = ['LIVE WEATHER', 'SMART GLOBE', 'MONSOON MODE', 'AQI TRACK', 'AI RAIN'];

export default function GeoTextNebula() {
  return (
    <motion.div
      className="absolute left-4 bottom-4 hidden lg:block pointer-events-none"
      initial={{ opacity: 0, y: 12, x: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.45 }}
    >
      <div className="corner-nebula-card">
        <div className="corner-nebula-glow" />
        <div className="relative z-10 px-4 pt-3 pb-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300/85 font-mono">
            AeroSphere 3D
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-100">Climate Motion Core</h3>

          <div className="mt-2 flex items-start gap-3">
            <div className="corner-prism-scene">
              <div className="corner-prism">
                <span className="corner-prism-face corner-prism-front">AERO</span>
                <span className="corner-prism-face corner-prism-back">LIVE</span>
                <span className="corner-prism-face corner-prism-right">AQI</span>
                <span className="corner-prism-face corner-prism-left">RAIN</span>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300/90 max-w-[140px]">
              Interactive weather intelligence in real-time.
            </p>
          </div>

          <div className="corner-ticker mt-2">
            <div className="corner-ticker-track">
              {TICKER_WORDS.concat(TICKER_WORDS).map((word, idx) => (
                <span key={`${word}-${idx}`}>{word}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
