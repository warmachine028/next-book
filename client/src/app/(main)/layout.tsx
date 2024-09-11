import { validateRequest } from '@/auth'
import { Menubar, Navbar } from '@/components'
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
			{children}
			<Menubar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
		</SessionProvider>
	)
}

export default MainLayout
