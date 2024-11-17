import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { FollowerInfo } from '@/types'
import { NotificationType } from '@prisma/client'
import { NextRequest } from 'next/server'

export const GET = async (_: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
	try {
		const { userId } = await params
		const { user: currentUser } = await validateRequest()

		if (!currentUser) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				followers: {
					where: {
						followerId: currentUser.id
					},
					select: {
						followerId: true
					}
				},
				_count: {
					select: {
						followers: true
					}
				}
			}
		})
		if (!user) {
			return Response.json({ error: 'User not found' }, { status: 404 })
		}
		const data: FollowerInfo = {
			followers: user._count.followers,
			isFollowedByUser: !!user.followers.length
		}
		return Response.json(data)
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export const POST = async (_: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
	try {
		const { userId } = await params
		const { user: currentUser } = await validateRequest()

		if (!currentUser) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}
		await prisma.$transaction([
			prisma.follow.upsert({
				where: {
					followerId_followingId: {
						followerId: currentUser.id,
						followingId: userId
					}
				},
				create: {
					followerId: currentUser.id,
					followingId: userId
				},
				update: {}
			}),
			prisma.notification.create({
				data: {
					isssuerId: currentUser.id,
					recipientId: userId,
					type: NotificationType.FOLLOW
				}
			})
		])


		return new Response()
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
	try {
		const { userId } = await params
		const { user: currentUser } = await validateRequest()

		if (!currentUser) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await prisma.$transaction([
			prisma.follow.deleteMany({
				where: {
					followerId: currentUser.id,
					followingId: userId
				}
			}),
			prisma.notification.deleteMany({
				where: {
					isssuerId: currentUser.id,
					recipientId: userId,
					type: NotificationType.FOLLOW
				}
			})
		])

		return new Response()
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
