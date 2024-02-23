//import { createVuePlugin } from 'vite-plugin-vue2';
import vue from '@vitejs/plugin-vue2'
import path from 'path';
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from 'url';
import { manualChunksPlugin } from 'vite-plugin-webpackchunkname';

export default {
    plugins: [
        //createVuePlugin(/* options */)
        vue(),
        visualizer(),
        manualChunksPlugin(),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
            //{ find: '@', replacement: path.resolve(__dirname, './src/') },
            {
                // this is required for the SCSS modules
                find: /^~(.*)$/,
                replacement: '$1',
            },
        ],
    },
    test: {
        globals: true,
        environment: "jsdom",
        isolate: false,
        threads: false,
        include: [
            'tests/**/*.spec.js',
        ],
        deps: {
            inline: [/vue/]
        }
    },
    build: {
        rollupOptions:{
            output: {
                manualChunks:  (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('bootstrap-vue') || 
                                id.includes('jsplumb')){
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                },
                manualChunks1: {
                    lodash: ['lodash'],
                    'bootstrap-vue': ['bootstrap-vue'],
                    plotly: ['plotly'],
                    'oidc-client': ['oidc-client'],
                }
            }
        }
    }
};
