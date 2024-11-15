import { type InfiniteData, type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from '@/components/comments/actions'
import { useToast } from '.'
import type { CommentsPage } from '@/types'

const useCreateCommentMutation = (postId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createComment,
		onSuccess: async (comment) => {
			const queryKey: QueryKey = ['comments', postId]

			await queryClient.cancelQueries({ queryKey })

			queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(queryKey, (data) => {
				const firstPage = data?.pages[0]

				if (firstPage) {
					return {
						pageParams: data.pageParams,
						pages: [
							{
								previousCursor: firstPage.previousCursor,
								comments: [...firstPage.comments, comment]
							},
							...data.pages.slice(1)
						]
					}
				}
			})
			queryClient.invalidateQueries({
				queryKey,
				predicate(query) {
					return !query.state.data
				}
			})
			toast({
				variant: 'success',
				description: 'Comment added'
			})
		},
		onError(error) {
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Failed to submit comment. Please try again.'
			})
		}
	})
}
export default useCreateCommentMutation
