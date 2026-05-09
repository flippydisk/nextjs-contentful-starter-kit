import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import * as importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';


export default [
    {
        ignores: ['.next/', '.next/**', '.next-dev/', '.next-dev/**', 'out/', 'out/**', '**/*.ts', '**/*.tsx', 'node_modules/*', 'public/', 'public/**']
    },
    {
        files: ['src/**/*.{js,mjs,cjs,jsx}']
    },
    {
        languageOptions: {
            // parser: babelParser, // Use Babel parser
            parserOptions: {
                requireConfigFile: false, // No need for a Babel config file
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true // Enable JSX support
                },
                babelOptions: {
                    plugins: ['@babel/plugin-syntax-jsx'] // Ensure JSX parsing
                }
            },
            globals: { ...globals.browser, ...globals.node }
        }
    },
    {
        plugins: {
            'jsx-a11y': jsxA11y,
            react: react,
            'react-hooks': reactHooks,
            '@next/next': next,
            import: importPlugin
        }
    },
    {
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.mjs', '.cjs', '.css'],
                    path: ['node_modules']
                }
            }
        }
    },
    {
        rules: {
            'semi': ['error', 'always'],
            'import/order': [
                'error',
                {
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
                    'newlines-between': 'never'
                }
            ],
            'import/no-useless-path-segments': [
                'error',
                {
                    noUselessIndex: true
                }
            ],
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: ['eslint.config.js', '**/test/**'],
                    optionalDependencies: false,
                    peerDependencies: false
                }
            ],
            'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
            'comma-dangle': ['error', 'never'],
            'comma-style': 'error',
            'constructor-super': 'off',
            'class-methods-use-this': 'off',
            'implicit-arrow-linebreak': 'error',
            'import/no-cycle': 'off',
            'indent': ['error', 4, { SwitchCase: 1 }],
            'lines-between-class-members': ['error'],
            'max-classes-per-file': 'off',
            'max-len': ['error', { code: 300, tabWidth: 4 }],
            'no-console': 'error',
            'no-multiple-empty-lines': 'error',
            'no-param-reassign': ['off'],
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            'no-restricted-globals': 'off',
            'no-undef': 'off',
            'object-curly-newline': ['error', { consistent: true }],
            'object-curly-spacing': ['error', 'always'],
            'operator-linebreak': ['error', 'before', { overrides: { '&&': 'after', '||': 'after' } }],
            'prefer-destructuring': [
                'error',
                {
                    VariableDeclarator: { array: true, object: true },
                    AssignmentExpression: { array: true, object: true }
                },
                { enforceForRenamedProperties: true }
            ],
            'react/jsx-closing-bracket-location': [
                'error',
                { selfClosing: 'line-aligned', nonEmpty: 'line-aligned' }
            ],
            'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
            'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
            ...reactHooks.configs.flat.recommended.rules,
            'no-lonely-if': 'error',
            'consistent-return': 'error',
            'no-undefined': 'off',
            'no-nested-ternary': 'error',
            'no-unneeded-ternary': 'error',
            eqeqeq: ['error', 'always'],
            'react/prop-types': 'off',
            'func-style': ['error', 'expression'],
            'no-use-before-define': ['error', { functions: true }],
            'quotes': ['error', 'single']
        }
    }
];
