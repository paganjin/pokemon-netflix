import path from 'node:path';
import { fileURLToPath } from 'node:url';

import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import stylisticjs from '@stylistic/eslint-plugin-js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/*.js',
      '**/*.d.ts',
      '**/dist',
      '**/.pnpm-store',
      '**/node_modules',
      '**/coverage',
      '**/.vite',
      'vite.config.ts',
      'vitest.config.ts',
      'setup.jsdom.ts',
    ],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      import: fixupPluginRules(_import),
      '@stylistic/js': stylisticjs,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },

    rules: {
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-hooks/set-state-in-effect': 'off', // Disable for CI/CD
      'react-hooks/exhaustive-deps': 'warn', // Make this a warning instead of error

      // Import ordering rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // TypeScript rules
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Stylistic rules
      '@stylistic/js/spaced-comment': [
        'error',
        'always',
        {
          markers: ['/'],
        },
      ],

      // General rules
      'no-fallthrough': 'warn',
      'no-shadow': [
        'warn',
        {
          builtinGlobals: false,
          hoist: 'functions',
          allow: [],
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
