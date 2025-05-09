import { validateRequest } from '@/auth'
import { Menubar, Navbar, Footer } from '@/components'
import { SessionProvider } from '@/providers'
import { redirect } from 'next/navigation'

const PlaygroundLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const session = await validateRequest()
	if (!session.user) {
		redirect('/login')
	}
	return (
		<SessionProvider value={session}>
			<Navbar />
			{children}
			<Menubar className="bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
			<Footer />
		</SessionProvider>
	)
}

export default PlaygroundLayout
