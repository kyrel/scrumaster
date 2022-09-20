/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');
const INLINE_ELEMENTS = require('eslint-plugin-vue/lib/utils/inline-non-void-elements.json');

module.exports = {
    root: true,
    'extends': [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-typescript'
    ],
    'rules': {
        'semi': ['error', 'always'],
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': 0,
        "vue/singleline-html-element-content-newline": ["warn", {
            "ignoreWhenNoAttributes": true,
            "ignoreWhenEmpty": true,
            "ignores": ["pre", "textarea", "router-link", ...INLINE_ELEMENTS]
        }]
    },
    parserOptions: {
        ecmaVersion: 'latest'
    }
};
