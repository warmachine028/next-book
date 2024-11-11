'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BellRing, Bookmark, Home, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface MenubarProps {
	className?: string
}

const Menubar = ({ className }: MenubarProps) => {
	const pathname = usePathname()
	const notificationCount = 100
	return (
		<aside className={cn('text-primary', className)}>
			<Button
				className={cn(
					'relative flex items-center justify-start gap-3 ring-primary',
					pathname === '/' && 'ring-1'
				)}
				variant="ghost"
				title="Home"
				asChild
			>
				<Link href="/">
					<Home />
					<span className="hidden lg:inline">Home</span>
				</Link>
			</Button>
			<Button
				className="relative flex items-center justify-start gap-3 ring-primary"
				variant="ghost"
				title="Notifications"
				asChild
			>
				<Link href="/notifications">
					<BellRing />
					<span className="hidden lg:inline">Notifications</span>
					<div className="absolute right-2.5 top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-destructive text-xs" />
				</Link>
			</Button>
			<Button
				className={cn(
					'flex items-center justify-start gap-3 ring-primary',
					pathname === '/messages' && 'ring-1'
				)}
				variant="ghost"
				title="Messages"
				asChild
			>
				<Link href="/messages">
					<MessageCircle />
					<span className="hidden lg:inline">Messages</span>
				</Link>
			</Button>
			<Button
				className={cn(
					'flex items-center justify-start gap-3 ring-primary',
					pathname === '/bookmarks' && 'ring-1'
				)}
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
