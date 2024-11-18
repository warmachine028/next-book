import { InfiniteData, QueryFilters, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationData, NotificationsPage } from '@/types'
import { kyInstance } from '@/lib/ky'

interface UseDeleteNotificationMutationProps {
	notificationId: string
}

const useDeleteNotificationMutation = ({ notificationId }: UseDeleteNotificationMutationProps) => {
	const queryClient = useQueryClient()
	const queryKey: QueryKey = ['notification-feed', notificationId]
	return useMutation({
		mutationFn: () => kyInstance.delete(`/api/notifications/${notificationId}`).json<NotificationData>(),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey })
			const previousState = queryClient.getQueryData<NotificationData>(queryKey)
			queryClient.setQueryData<NotificationData>(queryKey, () => previousState)
			return { previousState }
		},
		onSuccess: async (deletedNotification) => {
			const queryFilter: QueryFilters = { queryKey: ['notification-feed'] }

			await queryClient.cancelQueries(queryFilter)
			queryClient.setQueriesData<InfiniteData<NotificationsPage, string | null>>(queryFilter, (oldData) => {
				if (!oldData) {
					return
				}
				return {
					pageParams: oldData.pageParams,
					pages: oldData.pages.map((page) => ({
						nextCursor: page.nextCursor,
						notifications: page.notifications.filter((n) => n.id !== deletedNotification.id)
					}))
				}
			})
		},
		onError: (err, _, context) => {
			console.error(err)
			queryClient.setQueryData(queryKey, context?.previousState)
		},
		onSettled: () => {
			// Refetch after error or success
			queryClient.invalidateQueries({ queryKey })
		}
	})
}

export default useDeleteNotificationMutation
