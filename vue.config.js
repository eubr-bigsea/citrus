module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
  baseUrl: './',
  pluginOptions: {
      webpackBundleAnalyzer: {
          openAnalyzer: false
      }
  }
}

