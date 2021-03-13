const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
  },
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/dashboard': { page: '/dashboard' },
      '/create': { page: '/create' },
      '/login': { page: '/login' },
      '/register': { page: '/register' },
      '/profile': { page: '/profile' },
      '/create-channel': { page: '/create-channel' },
      '/404': { page: '/404' },
    };
  },
});
