import type { CommentsPage } from '@/types'
import { useQueryClient, useMutation, QueryKey, InfiniteData } from '@tanstack/react-query'
import { useToast } from '.'
import { deleteComment } from '@/components/comments/actions'

const useDeleteCommentMutation = () => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteComment,
		onSuccess: async (deletedComment) => {
			const queryKey: QueryKey = ['comments', deletedComment.postId]
			await queryClient.cancelQueries({ queryKey })
			queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(queryKey, (data) => {
				if (!data) {
					return
				}
				return {
					pageParams: data.pageParams,
					pages: data.pages.map((page) => ({
						previousCursor: page.previousCursor,
						comments: page.comments.filter((c) => c.id !== deletedComment.id)
					}))
				}
			})

			toast({
				variant: 'success',
				description: 'Comment deleted'
			})
		},
		onError: (error) => {
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Failed to delete comment. Please try again.'
			})
		}
	})
}

export default useDeleteCommentMutation
