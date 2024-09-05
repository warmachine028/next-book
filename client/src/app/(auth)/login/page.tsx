import { Metadata } from 'next'
import hero from '@/assets/login-image.jpg'
import Image from 'next/image'
import Link from 'next/link'
import { LogInForm } from '@/components'

export const metadata: Metadata = { title: 'Log In' }

const LogIn = () => {
	return (
		<div className="bg-card flex max-h-[40rem] w-full overflow-hidden rounded-2xl shadow-2xl sm:h-full md:min-w-[64rem] ring-1 ring-secondary">
			<Image src={hero} priority alt="log-in" className="hidden w-1/2 object-cover md:block" />

			<div className="w-full space-y-10 overflow-y-auto md:w-1/2 md:p-10">
				<div className="space-y-1 text-center">
					<h1 className="text-3xl font-bold">Welcome Back!</h1>
				</div>
				<div className="space-y-5 px-5">
					<LogInForm />
					<h6 className="block text-center">
						Don&apos;t have an account?{' '}
						<Link href="/signup" className="text-green-500 hover:font-semibold hover:underline">
							Sign up
						</Link>
					</h6>
				</div>
			</div>
		</div>
	)
}
export default LogIn
