//import { createVuePlugin } from 'vite-plugin-vue2';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from 'url';
import { manualChunksPlugin } from 'vite-plugin-webpackchunkname';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'unplugin-vue-components/resolvers'


export default defineConfig({
    define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    },
    plugins: [
        //createVuePlugin(/* options */)
        vue({
            template: {
                /*compilerOptions: {
                    compatConfig: {
                        MODE: 2,
                        ATTR_FALSE_VALUE: false,
                        WATCH_ARRAY: false,
                        RENDER_FUNCTION: true,
                        INSTANCE_SCOPED_SLOTS: true,

                    }
                }*/
            }
        }),
        visualizer(),
        manualChunksPlugin(),
        /* for boostrap-vue-next */
        Components({
            resolvers: [BootstrapVueNextResolver()],
          }),
    ],
    resolve: {
        alias: [
            /*
            {
                find: 'vue',
                replacement: '@vue/compat'
            },
            */
            {
                // this is required for the SCSS modules
                find: /^~(.*)$/,
                replacement: '$1',
            },
            /*
            {
                find: /^\/(.*)$/,
                replacement: path.resolve(__dirname, './src/$1')
            },*/
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
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
})
;
