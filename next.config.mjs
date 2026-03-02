/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'openweathermap.org',
                pathname: '/img/**',
            },
            {
                protocol: 'https',
                hostname: 'unpkg.com',
            },
        ],
    },
    // Transpile three.js related packages
    transpilePackages: ['three', 'react-globe.gl', 'globe.gl'],
};

export default nextConfig;
