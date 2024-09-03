import { validateRequest } from '@/auth'
import { Navbar } from '@/components'
import { SessionProvider } from '@/providers'
import { redirect } from 'next/navigation'

const MainLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const session = await validateRequest()
	if (!session.user) {
		redirect('/login')
	}
	return (
		<SessionProvider value={session}>
			<Navbar />
			<main className="mx-auto max-w-7xl p-5">{children}</main>
		</SessionProvider>
	)
}

export default MainLayout
