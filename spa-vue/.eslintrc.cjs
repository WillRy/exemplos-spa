/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    "env": {
        "es6": true
    },
    "rules": {
        "vue/multi-word-component-names": "off",
        "vue/no-reserved-component-names": "off",
        "vue/no-unused-components": ["error", {
            "ignoreWhenBindingPresent": true
        }],
        "vue/no-unused-vars": ["error", {
            "ignorePattern": "^_"
        }]
    },
    ignorePatterns: [
        'node_modules/',
        '**/node_modules/',
        '/**/node_modules/*',
        '**/externo/*',
        'externo/*',
        'src/components/resize/*'
    ]
}
