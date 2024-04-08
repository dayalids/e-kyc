/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  webpack: (
		config,
		{ buildId, dev, isServer, defaultLoaders, webpack }
	) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
  images: {
    domains: ['bbn-private-test.s3.ap-south-1.amazonaws.com']
  }
}

module.exports = nextConfig
