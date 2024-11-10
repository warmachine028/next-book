'use client'

import { useToast } from '@/hooks'
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { BookmarkInfo } from '@/types'
import { kyInstance } from '@/lib/ky'
import { Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
	postId: string
	initialState: BookmarkInfo
}

const BookmarkButton = ({ postId, initialState }: BookmarkButtonProps) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const queryKey: QueryKey = ['bookmark-info', postId]

	const { data } = useQuery({
		queryKey,
		queryFn: () => kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
		initialData: initialState,
		staleTime: Infinity
	})

	const { mutate } = useMutation({
		mutationFn: () =>
			data.isBookmarkedByUser ?
				kyInstance.delete(`/api/posts/${postId}/bookmarks`)
			:	kyInstance.post(`/api/posts/${postId}/bookmarks`),
		onMutate: async () => {
			toast({
				variant: 'info',
				description: `Post ${data.isBookmarkedByUser ? 'un' : ''}bookmarked`
			})
			await queryClient.cancelQueries({ queryKey })

			const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey)
			queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
				isBookmarkedByUser: !previousState?.isBookmarkedByUser
			}))
			return { previousState }
		},
		onError: (error, _, context) => {
			queryClient.setQueryData(queryKey, context?.previousState)
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Something went wrong. Please try again.'
			})
		}
	})

	return (
		<Button
			variant="ghost"
			aria-label={data.isBookmarkedByUser ? 'Unbookmark' : 'Bookmark'}
			aria-pressed={data.isBookmarkedByUser}
			aria-atomic
			onClick={() => mutate()}
			className="flex items-center gap-2 text-sm font-medium tabular-nums"
		>
			<Bookmark className={cn('size-4', data.isBookmarkedByUser && 'fill-primary text-primary')} />
		</Button>
	)
}

BookmarkButton.displayName = 'BookmarkButton'

export default BookmarkButton
