/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

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
        'vue/max-attributes-per-line': 0
    },
    parserOptions: {
        ecmaVersion: 'latest'
    }
};
