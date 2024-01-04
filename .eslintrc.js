module.exports = {
    env: {
        es2021: true,
    },
    extends: [
        // add more generic rulesets here, such as:
        // 'eslint:recommended',
        'plugin:vue/vue3-recommended',
        // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
    ],
    rules: {
        // override/add rules settings here, such as:
        // 'vue/no-unused-vars': 'error'
        //"no-trailing-spaces": "error",
        "semi": ["error",],
        "indent": ["error", 4],

        "vue/mustache-interpolation-spacing": ["error", "never"],
        "import/extensions": ["error", "ignorePackages", { "vue": "always" }],
        "vue/no-mutating-props": "warn",
        "vue/no-unused-vars": "warn",
        "vue/valid-v-model": "warn",
        "vue/multi-word-component-names": "warn",
        "vue/no-use-v-if-with-v-for": "warn",
        "vue/require-explicit-emits": "warn",
        "vue/no-deprecated-slot-attribute": "warn",
        "vue/no-v-html": "off",
        "vue/no-deprecated-filter": "warn",
        "vue/no-v-for-template-key-on-child": "off",

        "vue/html-indent": ["error", 4, /*{
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }*/
        ],
        /*
        "vue/max-len": ["error", {
            "code": 80,
            "template": 80,
            "tabWidth": 2,
            "comments": 80,
            "ignorePattern": "",
            "ignoreComments": false,
            "ignoreTrailingComments": false,
            "ignoreUrls": false,
            "ignoreStrings": false,
            "ignoreTemplateLiterals": false,
            "ignoreRegExpLiterals": false,
            "ignoreHTMLAttributeValues": false,
            "ignoreHTMLTextContents": false,
        }],
        */
        "vue/html-closing-bracket-newline": ["error", {
            "singleline": "never",
            "multiline": "never"
        }],
        "vue/first-attribute-linebreak": ["error", {
            "singleline": "beside",
            "multiline": "beside"
        }],
        "vue/max-attributes-per-line": ["error", {
            "singleline": {
                "max": 4
            },
            "multiline": {
                "max": 4
            }
        }]
    },
    plugins: ["import"],
};