/** @type {import('next').NextConfig} */
import type { NextConfig as Config } from 'next'
/*
Note: The React Compiler is currently only possible to use in Next.js through a Babel plugin. This will opt-out of Next.js's default Rust-based compiler, which could result in slower build times. We are working on support for the React Compiler as our default compiler.
*/

//? https://nextjs.org/docs/app/building-your-application/configuring/typescript#existing-projects

export default {
	experimental: {
		staleTimes: {
			dynamic: 30
		},
		reactCompiler: {
			compilationMode: 'annotation'
		}
		// typedRoutes: true // https://nextjs.org/docs/app/api-reference/next-config-js/typedRoutes
	},
	serverExternalPackages: ['@node-rs/argon2'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'utfs.io',
				pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`
			}
		]
	},
	rewrites: async () => {
		return [
			{
				source: '/hashtag/:tag',
				destination: '/search?q=%23:tag'
			}
		]
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true
	}
} satisfies Config
