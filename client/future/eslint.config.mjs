import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintConfigNext from 'eslint-config-next'
import reactCompiler from 'eslint-plugin-react-compiler'
import js from '@eslint/js'

export default [
	js.configs.recommended,
	eslintConfigPrettier,
	eslintConfigNext,
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		ignores: ['.next', 'node_modules', 'public', 'future'],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module'
			}
		},
		plugins: {
			'eslint-plugin-react-compiler': reactCompiler
		},
		rules: {
			'no-console': 'warn',
			'react-compiler/react-compiler': 'error',
			'no-unused-vars': [
				'warn',
				{
					vars: 'all',
					args: 'after-used',
					caughtErrors: 'all',
					ignoreRestSiblings: false,
					reportUsedIgnorePattern: false
				}
			]
		}
	}
]
