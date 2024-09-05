import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'

const AuthLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const { user } = await validateRequest()
	if (user) {
		redirect('/')
	}
	return <main className="container flex h-screen items-center justify-center p-5">{children}</main>
}

export default AuthLayout
