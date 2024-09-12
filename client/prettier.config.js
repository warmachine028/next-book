// import type { Config } from 'prettier'
// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs
import tailwindcss from 'prettier-plugin-tailwindcss'
import packageJson from 'prettier-plugin-packagejson'
/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
	experimentalTernaries: true,
	printWidth: 120,
	useTabs: true,
	semi: false,
	singleQuote: true,
	trailingComma: 'none',
	tabWidth: 4,
	arrowParens: 'always',
	bracketSpacing: true,
	parser: 'typescript',
	endOfLine: 'crlf',
	plugins: [tailwindcss, packageJson]
	// keep an empty line at the end of the file
}
