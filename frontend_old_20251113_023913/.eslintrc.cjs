/* eslint-env node */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react-refresh', 'react-hooks'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'plugin:react-refresh/recommended'],
	env: {
		browser: true,
		es2021: true
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	rules: {
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
	}
}


