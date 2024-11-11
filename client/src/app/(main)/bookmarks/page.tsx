import { BookmarksFeed, Menubar, TrendsSidebar } from '@/components'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Bookmarks'
}

const Bookmarks = () => {
	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="hidden h-fit flex-none space-y-3 rounded-md bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
			<div className="flex w-full min-w-0 gap-5">
				<div className="w-full min-w-0 space-y-5">
					<div className="rounded-md bg-card p-5 shadow-sm">
						<h1 className="text-center text-xl font-bold">Bookmarks</h1>
					</div>
					<ScrollArea className="h-[calc(100vh-300px)] min-h-96 min-w-full rounded-md">
						<BookmarksFeed />
					</ScrollArea>
				</div>
			</div>
			<TrendsSidebar />
		</main>
	)
}

export default Bookmarks
