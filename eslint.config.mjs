import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import pluginESLint from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import pluginAstro from 'eslint-plugin-astro';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat();
/**
 * @type {import("eslint").Linter.FlatConfig}
 */
export default [
  {
    plugins: {
      ['import']: pluginImport,
      ['jsx-a11y']: pluginJsxA11y,
      ['react']: pluginReact,
      ['react-hooks']: pluginReactHooks,
      ['unused-imports']: pluginUnusedImports,
    },
  },
  {
    ignores: [
      '**/dist/**',
      '**/.astro/**/*',
      '**/env.d.ts',
      '**/types.d.ts',
      '**/GoogleAnalytics.astro',
    ],
  },
  {
    languageOptions: {
      parser: typescriptEslintParser,
    },
  },
  eslint.configs.recommended,
  pluginPrettierRecommended,
  ...tseslint.configs.recommended,
  ...pluginAstro.configs['flat/recommended'],
  ...pluginAstro.configs['flat/jsx-a11y-recommended'],
  ...compat.config({
    ...pluginESLint.configs.recommended,
    extends: ['plugin:tailwindcss/recommended'],
  }),
  {
    rules: {
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
            'type',
          ],
          pathGroups: [
            // https://github.com/import-js/eslint-plugin-import/issues/970
            // {
            //   pattern: '@/styles/**',
            //   group: 'builtin',
            //   position: 'before',
            // },
            {
              pattern: '{react,react-dom}/**,react-router-dom}',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '{astro,astro/**,@astrojs/**,astro:**}',
              group: 'builtin',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'no-undef': 'off',
    },
  },
];
