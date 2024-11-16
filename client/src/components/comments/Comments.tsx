import { useInfiniteQuery } from '@tanstack/react-query'
import type { CommentsPage, PostData } from '@/types'
import { Input, Comment } from '.'
import { kyInstance } from '@/lib/ky'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'

interface CommentProps {
	post: PostData
}

const Comments = ({ post }: CommentProps) => {
	const { data, fetchNextPage, hasNextPage, isFetching, isSuccess, isError } = useInfiniteQuery({
		queryKey: ['comments', post.id],
		queryFn: ({ pageParam }) =>
			kyInstance
				.get(`/api/posts/${post.id}/comments`, pageParam ? { searchParams: { cursor: pageParam } } : {})
				.json<CommentsPage>(),
		initialPageParam: null as string | null,
		getNextPageParam: (firstPage) => firstPage.previousCursor,
		select: (data) => ({
			pages: [...data.pages].reverse(),
			nextCursor: [...data.pageParams].reverse()
		})
	})
	const comments = data?.pages.flatMap((page) => page.comments) || []
	return (
		<div className="space-y-3">
			<Input post={post} />
			<ScrollArea className="divide-y">
				{isFetching && (
					<div className="flex w-full items-center justify-center gap-2 py-3 text-center text-sm">
						<Loader2 className="animate-spin text-primary" />
						<span className="text-muted-foreground">Loading comments...</span>
					</div>
				)}
				{hasNextPage && (
					<Button
						variant="link"
						className="mx-auto block"
						disabled={isFetching}
						onClick={() => fetchNextPage()}
					>
						Load previous comments
					</Button>
				)}
				{isSuccess &&
					!comments.length && ( //
						<p className="my-3 text-center text-muted-foreground">No comments yet.</p>
					)}
				{isError && (
					<p className="text-center font-semibold text-destructive">
						An error occurred while loading comments.
					</p>
				)}
				{comments.map((comment) => (
					<Comment key={comment.id} comment={comment} />
				))}
			</ScrollArea>
		</div>
	)
}

export default Comments
