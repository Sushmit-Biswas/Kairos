const nextConfig = {
  output: 'standalone',
  // suppress experimental warnings if any
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
