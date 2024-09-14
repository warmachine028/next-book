'use client'

import { PostsPage } from '@/types'
import { kyInstance } from '@/lib/ky'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Post, InfiniteScrollContainer, LoadingSkeletonGroup, DeletePostDialog } from '@/components'
import { Button } from './ui/button'

const ForYouFeed = () => {
	const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: ['post-feed', 'for-you'],
		queryFn: ({ pageParam }) =>
			kyInstance
				.get('/api/posts/for-you', pageParam ? { searchParams: { cursor: pageParam } } : {})
				.json<PostsPage>(),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor
	})

	const posts = data?.pages.flatMap((page) => page.posts) || []

	if (status === 'pending') {
		return <LoadingSkeletonGroup />
	}
	if (status === 'success' && !posts.length && !hasNextPage) {
		return <p className="to-muted-foreground text-center">No one has posted anything yet.</p>
	}
	if (status === 'error') {
		return <p className="text-center text-destructive">An error occurred while loading posts</p>
	}

	return (
		<InfiniteScrollContainer
			onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
			className="space-y-5"
		>
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}
			{isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
			
			<Button onClick={() => fetchNextPage()}>Load more</Button>
		</InfiniteScrollContainer>
	)
}

ForYouFeed.displayName = 'ForYouFeed'

export default ForYouFeed
