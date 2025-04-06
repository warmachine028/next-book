import { ForYouFeed, Menubar, TrendsSidebar, PostEditor, FollowingFeed } from '@/components'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Page = () => {
	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="bg-card hidden h-fit flex-none space-y-3 rounded-md px-3 py-5 shadow-xs sm:block lg:px-5 xl:w-80" />
			<div className="flex w-full min-w-0 gap-5">
				<div className="w-full min-w-0 space-y-5">
					<PostEditor />
					<Tabs defaultValue="for-you">
						<TabsList className="bg-card mb-2 h-12 w-full gap-1 rounded-md shadow-xs">
							<TabsTrigger
								className="ring-primary hover:bg-background h-full flex-1 rounded-md data-[state=active]:font-bold"
								value="for-you"
							>
								For you
							</TabsTrigger>
							<TabsTrigger
								className="ring-primary hover:bg-background h-full flex-1 rounded-md data-[state=active]:font-bold"
								value="following"
							>
								Following
							</TabsTrigger>
						</TabsList>
						<ScrollArea className="h-[calc(100vh-390px)] min-h-96 min-w-full">
							<TabsContent value="for-you">
								<ForYouFeed />
							</TabsContent>
							<TabsContent value="following">
								<FollowingFeed />
							</TabsContent>
						</ScrollArea>
					</Tabs>
				</div>
			</div>
			<TrendsSidebar />
		</main>
	)
}

export default Page
