/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_HOSTPORT
  ? `http://${process.env.BACKEND_HOSTPORT}`
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
