const path = require('path');

module.exports = {
    reactStrictMode: true,
    images: {
      domains: [],
    },
    experimental: {
      appDir: true,
    },
    webpack(config) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@components': path.resolve(__dirname, 'components'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@context': path.resolve(__dirname, 'src/context'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
      };
      return config;
    },
  };