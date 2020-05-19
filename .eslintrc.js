module.exports = {
  root: false,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    'prettier/vue'
  ],
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': 'off', // process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off', //['error', { args: 'none', ignoreRestSiblings: false }],
    'prettier/prettier': 'off',
    'vue/no-v-html': 'off'
  },
  globals: {
    $nuxt: true,
    Vue: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
