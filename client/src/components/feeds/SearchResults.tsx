'use client'

import { PostsPage } from '@/types'
import { kyInstance } from '@/lib/ky'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Post, InfiniteScrollContainer, LoadingSkeletonGroup } from '@/components'
import { Button } from '@/components/ui/button'

interface SearchResultsProps {
	query: string
}

const SearchResults = ({ query }: SearchResultsProps) => {
	const {
		data, //
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status
	} = useInfiniteQuery({
		queryKey: ['post-feed', 'search', query],
		queryFn: ({ pageParam }) =>
			kyInstance
				.get('/api/search', {
					searchParams: {
						q: query,
						...(pageParam ? { cursor: pageParam } : {})
					}
				})
				.json<PostsPage>(),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		gcTime: 0
	})

	const posts = data?.pages.flatMap((page) => page.posts) || []

	if (status === 'pending') {
		return <LoadingSkeletonGroup />
	}
	if (status === 'success' && !posts.length && !hasNextPage) {
		return (
			<p className="line-clamp-2 break-all text-center text-muted-foreground">
				No results found for &quot;{query}&quot;.
			</p>
		)
	}
	if (status === 'error') {
		return <p className="text-center text-destructive">An error occurred while loading SearchResults.</p>
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

SearchResults.displayName = 'SearchResultsFeed'

export default SearchResults
