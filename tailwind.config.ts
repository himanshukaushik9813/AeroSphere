import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#020205',
          secondary: '#0a0a10',
          tertiary: '#12121a',
        },
        accent: {
          primary: '#B30C0B',
          secondary: '#585963',
          tertiary: '#B4B7CB',
        },
        text: {
          primary: '#E5E6F0',
          secondary: '#B4B7CB',
          muted: '#585963',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xl: '20px',
        '2xl': '40px',
        '3xl': '60px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-slow': 'orbit 30s linear infinite',
        'orbit-reverse': 'orbit 25s linear infinite reverse',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'data-pulse': 'data-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'glow-red': '0 0 40px rgba(179, 12, 11, 0.15), 0 0 80px rgba(179, 12, 11, 0.06)',
        'glow-red-lg': '0 0 60px rgba(179, 12, 11, 0.25), 0 0 120px rgba(179, 12, 11, 0.1)',
        'neon': '0 0 8px rgba(179, 12, 11, 0.4), 0 0 20px rgba(179, 12, 11, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
