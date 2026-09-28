import vue from 'eslint-plugin-vue';
import storybook from 'eslint-plugin-storybook';

export default [
    {
        ignores: ['.venv/**', 'dist/**', 'node_modules/**'],
    },
    ...vue.configs['flat/recommended'],
    ...storybook.configs['flat/recommended'],
    {
        rules: {
            semi: ['error'],
            indent: ['error', 4],
            'vue/mustache-interpolation-spacing': ['error', 'never'],
            'vue/no-mutating-props': 'warn',
            'vue/no-unused-vars': 'warn',
            'vue/valid-v-model': 'warn',
            'vue/multi-word-component-names': 'warn',
            'vue/no-use-v-if-with-v-for': 'warn',
            'vue/require-explicit-emits': 'warn',
            'vue/no-deprecated-slot-attribute': 'warn',
            'vue/no-v-html': 'off',
            'vue/no-deprecated-filter': 'warn',
            'vue/no-v-for-template-key-on-child': 'off',
            'vue/html-indent': ['error', 4],
            'vue/html-closing-bracket-newline': ['error', {
                singleline: 'never',
                multiline: 'never',
            }],
            'vue/first-attribute-linebreak': ['error', {
                singleline: 'beside',
                multiline: 'beside',
            }],
            'vue/max-attributes-per-line': ['error', {
                singleline: { max: 4 },
                multiline: { max: 4 },
            }],
        },
    },
];
