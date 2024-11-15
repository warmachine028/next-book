import { CommentsPage, type PostData } from '@/types'
import { Input, Comment } from '.'
import { useInfiniteQuery } from '@tanstack/react-query'
import { kyInstance } from '@/lib/ky'

interface CommentProps {
	post: PostData
}

const Comments = ({ post }: CommentProps) => {
	const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
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
			<div className="divide-y">
				{comments.map((comment) => (
					<Comment key={comment.id} comment={comment} />
				))}
			</div>
		</div>
	)
}

export default Comments
