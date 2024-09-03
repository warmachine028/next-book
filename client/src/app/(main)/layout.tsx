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
			<main className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
				<Menubar className="bg-card sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
				{children}
			</main>
			<Menubar className="bg-card sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden" />
		</SessionProvider>
	)
}

export default MainLayout
