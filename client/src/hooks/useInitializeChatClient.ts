import { useEffect, useState } from 'react'
import { kyInstance } from '@/lib/ky'
import { useSession } from '.'
import { StreamChat } from 'stream-chat'

const useInitializeChatClient = () => {
	const { user } = useSession()
	const [chatClient, setChatClient] = useState<StreamChat | null>(null)

	useEffect(() => {
		const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY as string)
		client
			.connectUser(
				{
					id: user.id,
					username: user.userName,
					name: user.displayName,
					image: user.avatarUrl
				},
				async () =>
					kyInstance
						.get('/api/get-token')
						.json<{ token: string }>()
						.then((data) => data.token)
			)
			.catch((err) => console.error('Failed to connect to chat client', err))
			.then(() => setChatClient(client))

		return () => {
			setChatClient(null)
			client
				.disconnectUser()
				.catch((err) => console.error('Failed to disconnect user', err))
				.then(() => console.log('Connection closed'))
		}
	}, [user.id, user.userName, user.displayName, user.avatarUrl])

	return chatClient
}

export default useInitializeChatClient
