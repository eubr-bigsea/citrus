/*const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;*/

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');    

module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            //new BundleAnalyzerPlugin(),
            //new HardSourceWebpackPlugin(),
            
        ],
        optimization: {
            minimize: false
        }
    },
    publicPath: './',
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: false,
            analyzerPort: 8081
        }
    },
    chainWebpack: config => {
        config.module.rules.delete('eslint');
        // Disable prefetching and preloading
        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
    }
};
