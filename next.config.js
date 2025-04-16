/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['as1.ftcdn.net'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '**',
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  