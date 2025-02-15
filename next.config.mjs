/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/sla',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return process.env.NODE_ENV === 'production'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8000/:path*',
          },
        ]
      : [];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'helpdesk.alphaspiderman.dev'],
    },
  },
};

export default nextConfig;
