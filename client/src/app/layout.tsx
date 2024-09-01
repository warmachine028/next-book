import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans'
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono'
})

export const metadata: Metadata = {
	title: {
		template: '%s | Next Book',
		default: 'Next Book'
	},
	description: 'A social media app for the Next Fans'
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		//? FIX: https://github.com/shadcn-ui/ui/issues/1906#issuecomment-1807426212
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout
