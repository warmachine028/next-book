import { InfiniteData, useMutation, useQueryClient, type QueryFilters } from '@tanstack/react-query'
import { useSession, useToast } from '.'
import { updatePost } from '@/components/posts/actions'
import { PostData, PostsPage } from '@/types'

const useUpdatePostMutation = () => {
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const { user } = useSession()

	return useMutation({
		mutationFn: updatePost,
		onSuccess: (updatedPost) => {
			const queryFilter = {
				queryKey: ['post-feed'],
				predicate(query) {
					return (
						query.queryKey.includes('for-you') ||
						(query.queryKey.includes('user-posts') && query.queryKey.includes(user.id))
					)
				}
			} satisfies QueryFilters
			queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(queryFilter, (oldData) => {
				const firstPage = oldData?.pages[0]
				if (firstPage) {
					return {
						pageParams: oldData.pageParams,
						pages: [
							{
								posts: firstPage.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
								nextCursor: firstPage.nextCursor
							},
							...oldData.pages.slice(1)
						]
					}
				}
			})
			queryClient.invalidateQueries({
				queryKey: queryFilter.queryKey,
				predicate(query) {
					return queryFilter.predicate(query) && !query.state.data
				}
			})
			toast({
				variant: 'success',
				title: 'Success',
				description: 'Post updated successfully'
			})
		},
		onError: (error) => {
			console.error(error)
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message
			})
		}
	})
}

export default useUpdatePostMutation
