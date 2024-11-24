'use client'

import { useSession } from '@/hooks'
import { ChannelList } from 'stream-chat-react'

const ChatSidebar = () => {
	const { user } = useSession()

	return (
		<div className="flex size-full flex-col border-e ring-1 md:w-72">
			<ChannelList filters={{ type: 'messaging', members: { $in: [user?.id] } }} showChannelSearch />
		</div>
	)
}

export default ChatSidebar
