import hero from '@/assets/signup-image.jpg'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SignUpForm from './SignUpForm'

export const metadata: Metadata = { title: 'Sign Up' }

const Page = () => {
	return (
		<main className="grid h-screen place-content-center p-5">
			<div className="bg-card flex h-full max-h-[40rem] w-full min-w-[64rem] overflow-hidden rounded-2xl shadow-2xl">
				<div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
					<div className="space-y-1 text-center">
						<h1 className="text-3xl font-bold">Join Us</h1>
						<p className="text-muted-foreground">
							A place where even <span className="italic">programmers</span> can find a frend
						</p>
					</div>
					<div className="space-y-5">
						<SignUpForm />
						<h6 className="block text-center">
							Already have an account?{' '}
							<Link href="/login" className="text-green-500 hover:font-semibold hover:underline">
								Log in
							</Link>
						</h6>
					</div>
				</div>
				<Image src={hero} priority alt="sign-up" className="hidden w-1/2 object-cover md:block" />
			</div>
		</main>
	)
}

export default Page
