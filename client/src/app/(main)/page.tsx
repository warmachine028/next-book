import { ForYouFeed, Menubar, TrendsSidebar, PostEditor, FollowingFeed } from '@/components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Home = () => {
	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
			<div className="flex w-full min-w-0 gap-5">
				<div className="w-full min-w-0 space-y-5">
					<PostEditor />
					<Tabs defaultValue="for-you">
						<TabsList className="h-12 w-full gap-1 bg-card shadow-sm">
							<TabsTrigger
								className="h-full flex-1 ring-primary hover:bg-background data-[state=active]:font-bold data-[state=active]:ring-1"
								value="for-you"
							>
								For you
							</TabsTrigger>
							<TabsTrigger
								className="h-full flex-1 ring-primary hover:bg-background data-[state=active]:font-bold data-[state=active]:ring-1"
								value="following"
							>
								Following
							</TabsTrigger>
						</TabsList>
						<TabsContent value="for-you">
							<ForYouFeed />
						</TabsContent>
						<TabsContent value="following">
							<FollowingFeed />
						</TabsContent>
					</Tabs>
				</div>
				<TrendsSidebar />
			</div>
		</main>
	)
}

export default Home
