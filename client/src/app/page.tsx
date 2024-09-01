import { ThemeSwitch } from '@/components/ThemeSwitch'
import Image from 'next/image'
import Link from 'next/link'

const Home = () => {
	return (
		<main className="grid h-screen w-full place-items-center">
			<div className="flex max-w-sm flex-col gap-10">
				<div className="inline-flex w-full items-center justify-between">
					<p>Switch themes</p>
					<ThemeSwitch />
				</div>
				<div className="flex gap-5">
					<Link
						className="bg-primary hover:text-foreground flex h-10 max-w-xs items-center justify-center rounded-full border border-solid px-4 text-sm transition-colors hover:border-primary hover:bg-transparent sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
						href="/signup"
					>
						Sign Up
					</Link>
					<Link
						className="border-primary hover:bg-primary hover:text-foreground flex h-10 max-w-xs items-center justify-center rounded-full border border-solid px-4 text-sm transition-colors hover:border-transparent sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
						href="/login"
					>
						Log In
					</Link>
				</div>
			</div>
		</main>
	)
}

export default Home
