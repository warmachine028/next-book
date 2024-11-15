import { type InfiniteData, type QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/components/posts/editor/actions'
import type { PostsPage } from '@/types'
import { useSession, useToast } from '.'

const useCreatePostMutation = () => {
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const { user } = useSession()

	return useMutation({
		mutationFn: createPost,
		onSuccess: async (newPost) => {
			const queryFilter = {
				queryKey: ['post-feed'],
				predicate(query) {
					return (
						query.queryKey.includes('for-you') ||
						(query.queryKey.includes('user-posts') && query.queryKey.includes(user.id))
					)
				}
			} satisfies QueryFilters
			await queryClient.cancelQueries(queryFilter)
			queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(queryFilter, (oldData) => {
				const firstPage = oldData?.pages[0]
				if (firstPage) {
					return {
						pageParams: oldData.pageParams,
						pages: [
							{
								posts: [newPost, ...firstPage.posts],
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
				description: 'Post created Successfully'
			})
		},
		onError: (error) => {
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Failed to add post. Please try again.'
			})
		}
	})
}

export default useCreatePostMutation
