import { Metadata } from 'next'
import hero from '@/assets/login-image.jpg'
import Image from 'next/image'
import Link from 'next/link'
import LogInForm from './LogInForm'

export const metadata: Metadata = {
	title: 'Log In'
}

const Page = () => {
	return (
		<main className="flex h-screen items-center justify-center p-5">
			<div className="bg-card flex h-full max-h-[40rem] w-full min-w-[64rem] overflow-hidden rounded-2xl shadow-2xl">
				<Image src={hero} priority={true} alt="log-in" className="hidden w-1/2 object-cover md:block" />

				<div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
					<h1 className="text-center text-3xl font-bold">Welcome Back</h1>
					<div className="space-y-5">
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
		</main>
	)
}
export default Page
