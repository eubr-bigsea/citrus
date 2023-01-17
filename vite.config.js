import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';

export default {
    plugins: [
        createVuePlugin(/* options */)
    ],
    resolve: {
        alias: [
            {
                // this is required for the SCSS modules
                find: /^~(.*)$/,
                replacement: '$1',
            },
            {
                find: /^\$SRC\/(.*)$/,
                replacement: path.resolve(__dirname, './src/$1')
            }
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
    },
}
