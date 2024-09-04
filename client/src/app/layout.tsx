import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from 'next-themes'

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

// TODO: shadcn-ui/toast
const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		//? FIX: https://github.com/shadcn-ui/ui/issues/1906#issuecomment-1807426212
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout
