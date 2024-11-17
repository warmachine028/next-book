'use client'

import { NotificationsPage } from '@/types'
import { kyInstance } from '@/lib/ky'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { InfiniteScrollContainer, LoadingSkeletonGroup, Notification } from '@/components'
import { Button } from '@/components/ui/button'

const Notifications = () => {
	const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: ['notification-feed'],
		queryFn: ({ pageParam }) =>
			kyInstance
				.get('/api/notifications', pageParam ? { searchParams: { cursor: pageParam } } : {})
				.json<NotificationsPage>(),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor
	})

	const notifications = data?.pages.flatMap((page) => page.notifications) || []

	if (status === 'pending') {
		return <LoadingSkeletonGroup />
	}
	if (status === 'success' && !notifications.length && !hasNextPage) {
		return <p className="to-muted-foreground text-center">You haven&apos;t have any notifications yet.</p>
	}
	if (status === 'error') {
		return <p className="text-center text-destructive">An error occurred while loading bookmarks.</p>
	}

	return (
		<InfiniteScrollContainer
			onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
			className="space-y-5"
		>
			{notifications.map((notification) => (
				<Notification key={notification.id} notification={notification} />
			))}
			{isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}

			<Button onClick={() => fetchNextPage()}>Load more</Button>
		</InfiniteScrollContainer>
	)
}

Notifications.displayName = 'BookmarksFeed'

export default Notifications
