// Flat ESLint config for Svelte 5 + TypeScript

import globals from 'globals';
import * as tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default [
	{
		ignores: [
			'build/**',
			'.svelte-kit/**',
			'node_modules/**',
			'eslint.config.js',
			'svelte.config.js',
			'**/*.svelte'
		]
	},
	// Base JS recommendations
	js.configs.recommended,
	// TypeScript with type-aware rules
	...tseslint.configs.recommendedTypeChecked,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.json']
			},
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			]
		}
	}
];
