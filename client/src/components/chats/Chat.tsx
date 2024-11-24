'use client'

import { useInitializeChatClient } from '@/hooks'
import { Loader2 } from 'lucide-react'
import { Sidebar, Channel } from '.'
import { Chat as StreamChat } from 'stream-chat-react'

const Chat = () => {
	const chatClient = useInitializeChatClient()

	if (!chatClient) {
		return <Loader2 className="animate-spin" />
	}

	return (
		<div className="absolute bottom-0 top-0 flex w-full">
			<StreamChat client={chatClient}>
				<Sidebar />
				<Channel />
			</StreamChat>
		</div>
	)
}

export default Chat
