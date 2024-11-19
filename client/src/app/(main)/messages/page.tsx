import { Chat, Menubar } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Messages'
}

const Page = () => {
	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="hidden h-fit flex-none space-y-3 rounded-md bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
			<div className="flex w-full min-w-0 gap-5">
				<div className="w-full min-w-0 space-y-5">
					<Chat />
				</div>
			</div>
		</main>
	)
}

export default Page