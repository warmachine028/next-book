import { validateRequest } from '@/auth'
import { prisma } from '@/lib'

export const PATCH = async () => {
	try {
		const { user } = await validateRequest()
		if (!user) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}
		await prisma.notification.updateMany({
			where: {
				recipientId: user.id,
				read: false
			},
			data: { read: true }
		})

		return Response.json({ message: 'Notifications marked as read' })
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
