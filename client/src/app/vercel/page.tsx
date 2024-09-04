import { AlertButton } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent } from 'react'

const Vercel = () => {
	return (
		<main className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
			<div className="row-start-2 flex flex-col gap-8 sm:items-start">
				<div className="flex w-full justify-start gap-4">
					<Image
						src="next.svg"
						width="0"
						height="0"
						className="h-auto w-44 dark:invert"
						alt="Next.js logo"
						priority
					/>
				</div>
				<ol className="list-inside list-decimal text-center font-mono text-sm sm:text-left">
					<li className="mb-2">
						Get started by editing{' '}
						<code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold">src/app/page.tsx</code>
					</li>
					<li>Save and see your changes instantly.</li>
				</ol>

				<div className="flex flex-col items-center gap-4 sm:flex-row">
					<Link
						className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:opacity-70 sm:h-12 sm:px-5 sm:text-base"
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="vercel.svg"
							width="0"
							height="0"
							className="h-auto w-5 dark:invert"
							alt="Vercel logomark"
							priority
						/>
						Deploy now
					</Link>
					<Link
						className="border-primary hover:bg-primary hover:text-foreground flex h-10 items-center justify-center rounded-full border border-solid px-4 text-sm font-medium transition-colors hover:border-transparent sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
						href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Read our docs
					</Link>
				</div>
				<AlertButton>Open alert</AlertButton>
			</div>
			<footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
				<Link
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image aria-hidden src="/file-text.svg" alt="File icon" width={16} height={16} />
					Learn
				</Link>
				<Link
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
					Examples
				</Link>
				<Link
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
					Go to nextjs.org →
				</Link>
			</footer>
		</main>
	)
}

export default Vercel
