/*const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;*/
const path = require('path');
module.exports = {
    productionSourceMap: false,
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            //new BundleAnalyzerPlugin(),
        ],
        optimization: {
            minimize: false
        },
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename]
            },
            cacheDirectory: path.resolve(__dirname, '.temp_cache'),
        },
    },
    publicPath: process.env.PUBLIC_URL || "/",
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
