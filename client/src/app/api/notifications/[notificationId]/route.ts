import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { NextRequest } from 'next/server'

export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ notificationId: string }> }) => {
	try {
		const { notificationId } = await params
		const { user: currentUser } = await validateRequest()

		if (!currentUser) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const deletedNotification = await prisma.notification.delete({
			where: {
				id: notificationId,
				recipientId: currentUser.id
			}
		})
		return Response.json(deletedNotification)
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
