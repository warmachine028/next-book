import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { NextRequest } from 'next/server'

export const PATCH = async (_: NextRequest, { params }: { params: Promise<{ notificationId: string }> }) => {
	try {
		const { notificationId } = await params
		const { user } = await validateRequest()

		if (!user) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await prisma.notification.update({
			where: {
				id: notificationId,
				recipientId: user.id
			},
			data: { read: true }
		})

		return Response.json({ message: 'Notification marked as read' })
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
