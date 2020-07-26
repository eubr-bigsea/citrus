const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            new BundleAnalyzerPlugin(),
        ],
        optimization: {
            minimize: true
        }
    },
    publicPath: './',
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: false
        }
    },
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    }
};
