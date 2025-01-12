import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import pluginJs from '@stylistic/eslint-plugin-js';
import pluginTs from '@stylistic/eslint-plugin-ts';

export default tseslint.config({
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },

    files: ['**/*.{js,cjs,mjs,ts,cts,mts}'],

    extends: [
        jseslint.configs.recommended,
        tseslint.configs.recommended,
    ],

    plugins: {
        '@stylistic/js': pluginJs,
        '@stylistic/ts': pluginTs,
    },

    rules: {
        'array-callback-return': ['error', { checkForEach: true }],
        curly: 'error',
        'default-param-last': 'error',
        'dot-notation': 'error',
        eqeqeq: 'error',
        'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
        'init-declarations': ['error', 'always'],
        'logical-assignment-operators': 'error',
        'max-depth': ['error', 4],
        'no-await-in-loop': 'error',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-else-return': 'error',
        'no-eq-null': 'error',
        'no-inner-declarations': 'error',
        'no-lonely-if': 'error',
        'no-loop-func': 'error',
        'no-multi-assign': 'error',
        'no-negated-condition': 'error',
        'no-nested-ternary': 'error',
        'no-param-reassign': 'error',
        'no-promise-executor-return': 'error',
        'no-return-assign': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-template-curly-in-string': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': 'error',
        'no-unsafe-finally': 'error',
        'no-unused-vars': 'off',
        'no-use-before-define': ['error', { functions: false }],
        'no-useless-computed-key': 'error',
        'no-useless-return': 'error',
        'object-shorthand': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
        'prefer-destructuring': ['error', { object: true }],
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'require-await': 'error',
        '@stylistic/js/array-bracket-newline': ['warn', { multiline: true /* minItems: 1 */ }],
        '@stylistic/js/array-bracket-spacing': 'warn',
        '@stylistic/js/array-element-newline': ['warn', { consistent: true, multiline: true }],
        '@stylistic/js/arrow-parens': [1, 'as-needed', { requireForBlockBody: true }],
        '@stylistic/js/arrow-spacing': 'warn',
        '@stylistic/js/brace-style': ['warn', 'stroustrup', { allowSingleLine: false }],
        '@stylistic/js/comma-dangle': [
            'warn',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'never',
            },
        ],
        '@stylistic/js/comma-spacing': 'warn',
        '@stylistic/js/dot-location': ['warn', 'property'],
        '@stylistic/js/eol-last': ['warn', 'always'],
        '@stylistic/js/indent': ['warn', 4, { SwitchCase: 1 }],
        '@stylistic/js/key-spacing': 'warn',
        '@stylistic/js/no-extra-parens': [
            'warn',
            'all',
            {
                nestedBinaryExpressions: false,
                ternaryOperandBinaryExpressions: false,
            },
        ],
        '@stylistic/js/no-extra-semi': 'warn',
        '@stylistic/js/no-mixed-operators': 'warn',
        '@stylistic/js/no-multiple-empty-lines': [
            'warn',
            {
                max: 1,
                maxBOF: 0,
                maxEOF: 0,
            },
        ],
        '@stylistic/js/no-trailing-spaces': 'warn',
        '@stylistic/js/object-curly-newline': 'warn',
        '@stylistic/js/object-curly-spacing': ['warn', 'always'],
        '@stylistic/js/operator-linebreak': [
            'warn',
            'after',
            {
                overrides: {
                    '=': 'ignore',
                    '?': 'ignore',
                    ':': 'ignore',
                },
            },
        ],
        '@stylistic/js/padded-blocks': ['warn', { blocks: 'never', switches: 'never' }],
        '@stylistic/js/padding-line-between-statements': [
            'warn',
            {
                blankLine: 'always',
                prev: '*',
                next: 'return',
            },
            {
                blankLine: 'always',
                prev: ['const', 'let', 'var'],
                next: ['expression'],
            },
            {
                blankLine: 'always',
                prev: ['expression', 'block-like'],
                next: ['const', 'let', 'var'],
            },
            {
                blankLine: 'always',
                prev: '*',
                next: ['block-like', 'export'],
            },
            {
                blankLine: 'always',
                prev: 'import',
                next: ['block-like', 'const', 'let', 'var', 'export', 'expression'],
            },
        ],
        '@stylistic/js/quote-props': ['warn', 'as-needed'],
        '@stylistic/js/quotes': ['warn', 'single'],
        '@stylistic/js/semi': ['warn', 'always'],
        '@stylistic/js/semi-spacing': 'warn',
        '@stylistic/js/semi-style': ['warn', 'last'],
        '@stylistic/js/space-before-function-paren': [
            'warn',
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        '@stylistic/js/space-in-parens': 'warn',
        '@stylistic/js/space-infix-ops': 'warn',
        '@stylistic/js/space-unary-ops': 'warn',
        '@stylistic/ts/type-annotation-spacing': [
            'warn',
            {
                before: false,
                after: true,
                overrides: {
                    arrow: {
                        before: true,
                        after: true,
                    },
                },
            },
        ],
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },

    ignores: [
        'dist/**',
        'node_modules/**',
    ],
});
