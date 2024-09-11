import { Menubar, TrendsSidebar } from '@/components'
import PostEditor from '@/components/posts/editor/PostEditor'
import Post from '@/components/posts/Post'
import { prisma } from '@/lib'
import { PostDataInclude } from '@/types'

const Home = async () => {
	const posts = await prisma.post.findMany({
		include: PostDataInclude,
		orderBy: { createdAt: 'desc' },
		cacheStrategy: { ttl: 60 }
	})
	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
			<div className="flex w-full min-w-0 gap-5">
				<div className="w-full min-w-0 space-y-5">
					<PostEditor />
					{posts.map((post) => (
						<Post key={post.id} post={post} />
					))}
				</div>
				<TrendsSidebar />
			</div>
		</main>
	)
}

export default Home
