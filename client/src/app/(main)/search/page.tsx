import { SearchResultsFeed, Menubar, TrendsSidebar } from '@/components'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Metadata } from 'next'

interface PageProps {
	searchParams: Promise<{ q: string }>
}

export const generateMetadata = async ({ searchParams }: PageProps): Promise<Metadata> => {
	const { q } = await searchParams
	return {
		title: `Search results for "${q}"`
	}
}

const Page = async ({ searchParams }: PageProps) => {
	const { q } = await searchParams
	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="hidden h-fit flex-none space-y-3 rounded-md bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
			<div className="flex w-full min-w-0 gap-5">
				<div className="w-full min-w-0 space-y-5">
					<div className="rounded-md bg-card p-5 shadow-sm">
						<h1 className="line-clamp-2 break-all text-center text-xl font-bold">
							Search results for &quot;{q}&quot;
						</h1>
					</div>
					<ScrollArea className="h-[calc(100vh-300px)] min-h-96 min-w-full rounded-md">
						<SearchResultsFeed query={q} />
					</ScrollArea>
				</div>
			</div>
			<TrendsSidebar />
		</main>
	)
}

export default Page
