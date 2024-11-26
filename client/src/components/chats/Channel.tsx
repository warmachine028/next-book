'use client'

import {
	ChannelHeader as StreamChannelHeader,
	type ChannelHeaderProps as StreamChannelHeaderProps,
	MessageInput,
	MessageList,
	Channel as StreamChannel,
	Window
} from 'stream-chat-react'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatChannelProps {
	open: boolean
	openSidebar: () => void
}

const Channel = ({ open, openSidebar }: ChatChannelProps) => {
	return (
		<div className={cn('w-full md:block', !open && 'hidden')}>
			<StreamChannel>
				<Window>
					<ChannelHeader openSidebar={openSidebar} />
					<MessageList />
					<MessageInput />
				</Window>
			</StreamChannel>
		</div>
	)
}

interface ChannelHeaderProps extends StreamChannelHeaderProps {
	openSidebar: () => void
}

const ChannelHeader = ({ openSidebar, ...props }: ChannelHeaderProps) => {
	return (
		<div className="flex items-center gap-3">
			<div className="h-full p-2 md:hidden">
				<Button size="icon" variant="ghost" onClick={openSidebar}>
					<Menu className="size-5" />
				</Button>
			</div>
			<StreamChannelHeader {...props} />
		</div>
	)
}

export default Channel
