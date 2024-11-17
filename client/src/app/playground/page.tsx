import { Post } from './(post)'

const Page = () => {
	const post = {
		id: '',
		title: 'Amazing Sunset View',
		content: 'Just witnessed the most breathtaking sunset at the beach. The colors were absolutely magical!',
		media: [
			{
				type: 'image' as const,
				url: 'https://picsum.photos/id/970/800/400'
			}
		],
		createdAt: new Date(),
		isLiked: false,
		isBookmarked: false
	}
	return (
		<div className="flex min-h-screen items-center justify-center">
			<Post post={post} />
		</div>
	)
}

export default Page
