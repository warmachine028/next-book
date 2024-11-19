import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { ReactQueryprovider } from '@/providers'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { fileRouter } from './api/uploadthing/core'
import './globals.css'
import 'stream-chat-react/dist/css/v2/index.css'

const geistSans = localFont({
	src: '../assets/fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	preload: false
})
const geistMono = localFont({
	src: '../assets/fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	preload: false
})

export const metadata: Metadata = {
	title: {
		template: '%s | Next Book',
		default: 'Next Book'
	},
	description: 'A full-stack social media web app built on NextJS 15 for the Next Fans'
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		//? FIX: https://github.com/shadcn-ui/ui/issues/1906#issuecomment-1807426212
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
				<ReactQueryprovider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
					</ThemeProvider>
				</ReactQueryprovider>
				<Toaster />
			</body>
		</html>
	)
}

export default RootLayout
