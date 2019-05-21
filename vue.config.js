module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: './',
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
};
