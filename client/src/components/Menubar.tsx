'use server'
import Link from 'next/link'
import { cn, prisma, streamServerClient } from '@/lib'
import { Button } from '@/components/ui/button'
import { Bookmark, Home, MessageCircle } from 'lucide-react'
import { ChatButton, NotificationsButton } from '.'
import { validateRequest } from '@/auth'
;('')

interface MenubarProps {
	className?: string
}

const Menubar = async ({ className }: MenubarProps) => {
	const { user } = await validateRequest()
	if (!user) {
		return null
	}
	const [unreadNotificationCount, unreadChatCount] = await Promise.all([
		prisma.notification.count({
			where: {
				recipientId: user.id,
				read: false
			}
		}),
		(await streamServerClient.getUnreadCount(user.id)).total_unread_count
	])

	return (
		<aside className={cn('text-primary', className)}>
			<Button
				className="relative flex items-center justify-start gap-3 ring-primary"
				variant="ghost"
				title="Home"
				asChild
			>
				<Link href="/">
					<Home />
					<span className="hidden lg:inline">Home</span>
				</Link>
			</Button>
			<NotificationsButton
				initialState={{
					unreadCount: unreadNotificationCount
				}}
			/>
			<ChatButton
				initialState={{
					unreadCount: unreadChatCount
				}}
			/>
			<Button
				className="flex items-center justify-start gap-3 ring-primary"
				variant="ghost"
				title="Bookmarks"
				asChild
			>
				<Link href="/bookmarks">
					<Bookmark />
					<span className="hidden lg:inline">Saved</span>
				</Link>
			</Button>
		</aside>
	)
}

Menubar.displayName = 'Menubar'

export default Menubar
