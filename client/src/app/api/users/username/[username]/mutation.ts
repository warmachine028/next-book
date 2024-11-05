import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserProfile } from './actions'
import { useToast, useUploadThing } from '@/hooks'
import { useRouter } from 'next/navigation'
import { UpdateUserProfileValues } from '@/lib/validation'
import { PostsPage } from '@/types'

export const useUpdateProfileMutation = () => {
	const { toast } = useToast()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { startUpload } = useUploadThing('avatar')

	const mutation = useMutation({
		mutationFn: ({ values, avatar }: { values: UpdateUserProfileValues; avatar?: File }) =>
			Promise.all([
				updateUserProfile(values), //
				avatar && startUpload([avatar])
			]),
		onSuccess: async ([updatedUser, uploadResult]) => {
			const avatarUrl = uploadResult?.[0].serverData.avatarUrl

			const queryFilter: QueryFilters = {
				queryKey: ['post-feed']
			}
			await queryClient.cancelQueries(queryFilter)

			queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(queryFilter, (oldData) => {
				if (!oldData) {
					return
				}
				return {
					pageParams: oldData.pageParams,
					pages: oldData.pages.map((page) => ({
						nextCursor: page.nextCursor,
						posts: page.posts.map((post) => {
							if (post.authorId === updatedUser.id) {
								return {
									...post,
									user: {
										...updatedUser,
										avatarUrl: avatarUrl ?? updatedUser.avatarUrl
									}
								}
							}
							return post
						})
					}))
				}
			})

			router.refresh()

			toast({ variant: 'success', description: 'Profile updated' })
		},
		onError(error) {
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Failed to update profile. Please try again'
			})
		}
	})

	return mutation
}
