// Canonical ESLint flat config for fleet CLIENT workspaces (TS + React + Vite).
// Source of truth — copied to each app as client/eslint.config.js. Edit here,
// then re-copy across the fleet (see shared/STRUCTURE.md § ESLint).
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // Same pragmatic relaxations the server config uses, kept in sync so the
    // fleet has one consistent rule philosophy.
    rules: {
      'no-empty': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Advisory/HMR + React-Compiler data-fetch rules: keep as warnings so they
      // don't block, and so the shared ThemeContext/ui pattern isn't fragmented.
      // The correctness rules (rules-of-hooks, immutability, purity, refs,
      // static-components) stay at their recommended (error) level.
      'react-refresh/only-export-components': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])