const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://sportshub.perfectgym.com',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader(
          'Referer',
          'https://sportshub.perfectgym.com/clientportal2/',
        );
        proxyReq.setHeader('Origin', 'https://sportshub.perfectgym.com');
      },
    }),
  );
};
