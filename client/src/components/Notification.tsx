'use client'

import { cn } from '@/lib/utils'
import { NotificationData } from '@/types'
import { NotificationType } from '@prisma/client'
import { Heart, MessageCircle, Trash2, User2 } from 'lucide-react'
import type { JSX } from 'react'
import { Avatar } from '.'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { kyInstance } from '@/lib/ky'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'
import { useDeleteNotificationMutation } from '@/hooks'

interface NotificationProps {
	notification: NotificationData
}

const Notification = ({ notification }: NotificationProps) => {
	const notificationTypeMap: Record<
		NotificationType,
		{
			message: string
			icon: JSX.Element
			href: string
			color: string
		}
	> = {
		[NotificationType.FOLLOW]: {
			message: 'followed you',
			icon: <User2 size={20} />,
			href: `/users/${notification.issuer.userName}`,
			color: 'text-blue-500'
		},
		[NotificationType.COMMENT]: {
			message: 'commented on your post',
			icon: <MessageCircle size={20} />,
			href: `/posts/${notification.postId}`,
			color: 'text-green-500'
		},
		[NotificationType.LIKE]: {
			message: 'liked your post',
			icon: <Heart size={20} />,
			href: `/posts/${notification.postId}`,
			color: 'text-red-500'
		}
	}
	const router = useRouter()
	const { message, icon, href, color } = notificationTypeMap[notification.type]

	const queryClient = useQueryClient()
	const { mutate: markAsRead } = useMutation({
		mutationFn: () => kyInstance.patch(`/api/notifications/${notification.id}/mark-as-read`),
		onSuccess: () =>
			queryClient.setQueryData(['unread-notification', notification.id], {
				read: true
			}),
		onError: (error) => console.error('Failed to mark notification as read', error)
	})
	const { mutate: deleteNotification } = useDeleteNotificationMutation({ notificationId: notification.id })
	const handleClick = async () => {
		markAsRead()
		router.push(href)
	}
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
		>
			<Card
				className={cn(
					'cursor-pointer overflow-hidden transition-all duration-300 hover:bg-primary/5 hover:shadow-md',
					!notification.read && 'bg-primary/5'
				)}
			>
				<CardContent className="p-4">
					<div className="flex items-start space-x-4">
						<div className={cn('rounded-full p-2', color, 'bg-black/10')}>{icon}</div>
						<div className="flex-1 space-y-1">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Avatar url={notification.issuer.avatarUrl} size={36} />
									<span className="font-medium">{notification.issuer.displayName}</span>
								</div>
								<span className="text-xs text-muted-foreground">
									{new Date(notification.createdAt).toLocaleDateString()}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<div onClick={handleClick}>
									<p className="text-sm text-muted-foreground">{message}</p>
									{notification.post && (
										<div className="mt-2 rounded-md text-sm">
											<p className="line-clamp-2 text-muted-foreground">
												{notification.post.content}
											</p>
										</div>
									)}
								</div>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => deleteNotification()}
									className="text-destructive"
								>
									<Trash2 size={20} />
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

Notification.displayName = 'Notification'
export default Notification
