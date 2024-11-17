import { cn } from '@/lib/utils'
import { NotificationData } from '@/types'
import { NotificationType } from '@prisma/client'
import { Heart, MessageCircle, User2 } from 'lucide-react'
import Link from 'next/link'
import type { JSX } from 'react'
import Avatar from './Avatar'

interface NotificationProps {
	notification: NotificationData
}

export const Notification = ({ notification }: NotificationProps) => {
	const notificationTypeMap: Record<
		NotificationType,
		{
			message: string
			icon: JSX.Element
			href: string
		}
	> = {
		[NotificationType.FOLLOW]: {
			message: `${notification.issuer.displayName} followed you`,
			icon: <User2 className="size-7 text-primary" />,
			href: `/users/${notification.issuer.userName}`
		},
		[NotificationType.COMMENT]: {
			message: `${notification.issuer.displayName} commented on your post`,
			icon: <MessageCircle className="size-7 text-success fill-success" />,
			href: `/posts/${notification.postId}`
		},
		[NotificationType.LIKE]: {
			message: `${notification.issuer.displayName} liked your post`,
			icon: <Heart className="size-7 text-destructive fill-destructive" />,
			href: `/posts/${notification.postId}`
		}
	}

	const { message, icon, href } = notificationTypeMap[notification.type]

	return (
		<Link href={href} className="block">
			<article
				className={cn(
					'flex items-center gap-3 rounded-2xl shadow-sm transition-colors hover:bg-card/70',
					!notification.read && 'bg-primary/10'
				)}
			>
				<div className="my-1">{icon}</div>
				<div className="space-y-3">
					<Avatar url={notification.issuer.avatarUrl} size={36} />
					<div>
						<span className="font-bold">{notification.issuer.displayName}</span>{' '}
						<span className="">{message}</span>
					</div>
					{notification.post && (
						<div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
							{notification.post.content}
						</div>
					)}
				</div>
			</article>
		</Link>
	)
}

Notification.displayName = 'Notification'

export default Notification
