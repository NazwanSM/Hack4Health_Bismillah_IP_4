/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  reactStrictMode: true,
  // Tambahkan konfigurasi headers untuk Geolocation API
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'geolocation=self', // Mengizinkan geolocation hanya untuk origin sendiri
          },
        ],
      },
    ];
  },
  // Menambahkan konfigurasi untuk permintaan ke Google Maps API (opsional jika digunakan)
  images: {
    domains: ['maps.googleapis.com'],
  },
};

module.exports = withPWA(nextConfig);