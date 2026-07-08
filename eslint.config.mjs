import pluginJs from '@eslint/js';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules/**',
      'package-lock.json',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPlaywright.configs['flat/recommended'],
  {
    rules: {
      // Prettier
      'prettier/prettier': 'error',

      // Playwright
      'playwright/prefer-lowercase-title': [
        'error',
        {
          ignore: ['test.describe'],
          ignoreTopLevelDescribe: true,
        },
      ],
      'playwright/no-nested-step': 'off',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',

      // General JavaScript/TypeScript
      'no-console': 'warn',
      'no-var': 'error',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      camelcase: ['error', { properties: 'never' }],
      'no-unused-expressions': ['error', { allowTernary: true }],
      'class-methods-use-this': 'error',
      'require-await': 'error',
    },
    settings: {
      playwright: {
        globalAliases: {
          test: ['setup'],
        },
      },
    },
  },
  eslintPluginPrettierRecommended,
];
