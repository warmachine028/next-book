'use client'

import { Chat as StreamChat } from 'stream-chat-react'
import { useInitializeChatClient, useSession } from '@/hooks'
import { useTheme } from 'next-themes'
import { Loader2 } from 'lucide-react'
import { Sidebar, Channel } from '.'
import { useEffect, useState } from 'react'

const Chat = () => {
	const chatClient = useInitializeChatClient()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { resolvedTheme } = useTheme()
	const { user } = useSession()

	useEffect(() => {
		if (chatClient) {
			const checkChannels = async () => {
				const filter = { type: 'messaging', members: { $in: [user?.id] } }
				const channels = await chatClient.queryChannels(filter, {}, { limit: 1 })
				setSidebarOpen(channels.length === 0)
			}
			checkChannels()
		}
	}, [chatClient])

	if (!chatClient) {
		return <Loader2 className="animate-spin" />
	}

	return (
		<div className="absolute bottom-0 top-0 flex w-full">
			<StreamChat
				client={chatClient}
				theme={resolvedTheme === 'dark' ? 'str-chat__theme-dark' : 'str-chat__theme-light'}
			>
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<Channel open={!sidebarOpen} openSidebar={() => setSidebarOpen(true)} />
			</StreamChat>
		</div>
	)
}

export default Chat
