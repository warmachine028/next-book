'use client'

import { NotificationUnreadCountInfo } from '@/types'
import { BellRing } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { kyInstance } from '@/lib/ky'

interface NotificationsButtonProps {
	initialState: NotificationUnreadCountInfo
}

const NotificationsButton = ({ initialState }: NotificationsButtonProps) => {
	const { data } = useQuery({
		queryKey: ['unread-notification-count'],
		queryFn: () => kyInstance.get('/api/notifications/unread-count').json<NotificationUnreadCountInfo>(),
		initialData: initialState,
		refetchInterval: 60 * 1000
	})
	return (
		<Button
			className="flex items-center justify-start gap-3 ring-primary"
			variant="ghost"
			title="Notifications"
			asChild
		>
			<Link href="/notifications">
				<div className="relative">
					<BellRing />
					{!!data?.unreadCount && (
						<span className="absolute -right-1 -top-1 size-4 rounded-full bg-red-600 text-center text-xs tabular-nums text-primary-foreground">
							{data.unreadCount}
						</span>
					)}
				</div>
				<span className="hidden lg:inline">Notifications</span>
			</Link>
		</Button>
	)
}

NotificationsButton.displayName = 'NotificationsButton'

export default NotificationsButton
