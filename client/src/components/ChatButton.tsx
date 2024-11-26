'use client'

import type { ChatCountInfo } from '@/types'
import { MessageCircle } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { kyInstance } from '@/lib/ky'

interface ChatButtonProps {
	initialState: ChatCountInfo
}

const ChatButton = ({ initialState }: ChatButtonProps) => {
	const { data } = useQuery({
		queryKey: ['unread-chats-count'],
		queryFn: () => kyInstance.get('/api/chats/unread-count').json<ChatCountInfo>(),
		initialData: initialState,
		refetchInterval: 60 * 1000
	})
	return (
		<Button className="flex items-center justify-start gap-3 ring-primary" variant="ghost" title="Messages" asChild>
			<Link href="/messages">
				<div className="relative">
					<MessageCircle />
					{!!data?.unreadCount && (
						<span className="absolute -right-1 -top-1 size-4 rounded-full bg-red-600 text-center text-xs tabular-nums text-primary-foreground">
							{data.unreadCount}
						</span>
					)}
				</div>
				<span className="hidden lg:inline">Messages</span>
			</Link>
		</Button>
	)
}

ChatButton.displayName = 'ChatButton'

export default ChatButton
