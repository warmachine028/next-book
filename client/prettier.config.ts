/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
import type { Config } from 'prettier'
// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

export default {
	arrowParens: 'always',
	bracketSpacing: true,
	endOfLine: 'lf',
	plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
	printWidth: 120,
	semi: false,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'none',
	useTabs: true
} satisfies Config
