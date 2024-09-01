/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		staleTimes: {
			dynamic: 30
		},
		reactCompiler: {
                        compilationMode: 'annotation',
                },
	},
	serverExternalPackages: ['@node-rs/argon2']
}

export default nextConfig
