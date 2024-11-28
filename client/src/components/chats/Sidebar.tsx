'use client'

import { ChannelList, ChannelPreviewMessenger, ChannelPreviewUIComponentProps } from 'stream-chat-react'
import { useCallback, useEffect, useState } from 'react'
import { MailPlus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useInitializeChatClient, useSession } from '@/hooks'
import { NewChatDialog } from '.'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
	open: boolean
	onClose: () => void
}

const ChatSidebar = ({ open, onClose }: ChatSidebarProps) => {
	const { user } = useSession()

	const ChannelPreview = useCallback(
		(props: ChannelPreviewUIComponentProps) => (
			<ChannelPreviewMessenger
				{...props}
				onSelect={() => {
					props.setActiveChannel?.(props.channel, props.watchers)
					onClose()
				}}
			/>
		),
		[onClose]
	)
	return (
		<div className={cn('size-full flex-col md:flex md:w-72', open ? 'flex' : 'hidden')}>
			<MenuHeader onClose={onClose} />
			<ChannelList
				showChannelSearch
				filters={{ type: 'messaging', members: { $in: [user?.id] } }}
				options={{ state: true, presence: true, limit: 8 }}
				sort={{ last_message_at: -1 }}
				additionalChannelSearchProps={{
					searchForChannels: true,
					searchQueryParams: {
						channelFilters: { filters: { members: { $in: [user?.id] } } }
					}
				}}
				Preview={ChannelPreview}
			/>
		</div>
	)
}

interface MenuHeaderProps {
	onClose: () => void
}

const MenuHeader = ({ onClose }: MenuHeaderProps) => {
	const [showNewChatDialog, setShowNewChatDialog] = useState(false)
	const chatClient = useInitializeChatClient()
	const { user } = useSession()
	const [channels, setChannels] = useState(0)

	useEffect(() => {
		if (chatClient) {
			const checkChannels = async () => {
				const filter = { type: 'messaging', members: { $in: [user?.id] } }
				const channels = await chatClient.queryChannels(filter, {}, { limit: 1 })
				setChannels(channels.length)
			}
			checkChannels()
		}
	}, [chatClient])

	return (
		<>
			<div className="flex items-center gap-3 bg-card p-2">
				<div className="h-full md:hidden">
					<Button size="icon" variant="ghost" onClick={onClose} disabled={!channels}>
						<X className="size-5" />
					</Button>
				</div>
				<h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
				<Button size="icon" variant="ghost" title="Start new chat" onClick={() => setShowNewChatDialog(true)}>
					<MailPlus className="size-5" />
				</Button>
			</div>
			{showNewChatDialog && (
				<NewChatDialog
					onOpenChange={setShowNewChatDialog}
					onChatCreated={() => {
						setShowNewChatDialog(false)
						onClose()
					}}
				/>
			)}
		</>
	)
}

export default ChatSidebar
