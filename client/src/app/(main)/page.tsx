import PostEditor from '@/components/posts/editor/PostEditor'
import Post from '@/components/posts/Post'
import { prisma } from '@/lib'
import { PostDataInclude } from '@/types'

const Home = async () => {
	const posts = await prisma.post.findMany({
		include: PostDataInclude,
		orderBy: { createdAt: 'desc' },
		// cacheStrategy: { ttl: 60 },
	})
	return (
		<div className="flex w-full">
			<div className="w-full min-w-0 space-y-5">
				<PostEditor />
				{posts.map((post) => (
					<Post key={post.id} post={post} />
				))}
			</div>
		</div>
	)
}

export default Home
