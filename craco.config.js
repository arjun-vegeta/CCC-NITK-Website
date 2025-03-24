const { addAfterLoader, loaderByName } = require('@craco/craco');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      addAfterLoader(webpackConfig, loaderByName('babel-loader'), {
        test: /\.mdx?$/,
        use: ['babel-loader', '@mdx-js/loader'],
      });
      return webpackConfig;
    },
  },
};