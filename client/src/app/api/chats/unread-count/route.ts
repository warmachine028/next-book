import { validateRequest } from '@/auth'
import { streamServerClient } from '@/lib'
import type { ChatCountInfo } from '@/types'

export const GET = async () => {
	try {
		const { user } = await validateRequest()
		if (!user) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { total_unread_count } = await streamServerClient.getUnreadCount(user.id)

		const data: ChatCountInfo = {
			unreadCount: total_unread_count
		}
		return Response.json(data)
	} catch (error) {
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
