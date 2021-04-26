require('dotenv').config();

module.exports = {
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/dashboard': { page: '/dashboard' },
      '/create': { page: '/create' },
      '/login': { page: '/login' },
      '/register': { page: '/register' },
      '/profile': { page: '/profile' },
      '/create-channel': { page: '/create-channel' },
      '/privacypolicies': { page: '/privacypolicies' },
      '/404': { page: '/404' },
    };
  },
  env: {
    API_URL: process.env.API_URL,
  },
};
