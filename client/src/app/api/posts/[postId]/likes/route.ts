import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { LikeInfo } from '@/types'
import { NextRequest } from 'next/server'

export const GET = async (_: NextRequest, { params }: { params: Promise<{ postId: string }> }) => {
	try {
		const { postId } = await params
		const { user: currentUser } = await validateRequest()

		if (!currentUser) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: {
				likes: {
					where: {
						userId: currentUser.id
					},
					select: {
						userId: true
					}
				},
				_count: {
					select: {
						likes: true
					}
				}
			}
		})

		if (!post) {
			return Response.json({ error: 'Post not found' }, { status: 404 })
		}

		const data: LikeInfo = {
			likes: post._count.likes,
			isLikedByUser: !!post.likes.length
		}
		return Response.json(data)
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export const POST = async (_: NextRequest, { params }: { params: Promise<{ postId: string }> }) => {
	try {
		const { postId } = await params
		const { user: currentUser } = await validateRequest()

		if (!currentUser) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await prisma.like.upsert({
			where: {
				userId_postId: {
					userId: currentUser.id,
					postId
				}
			},
			create: {
				userId: currentUser.id,
				postId
			},
			update: {}
		})
		return new Response()
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ postId: string }> }) => {
	try {
		const { postId } = await params
		const { user: currentUser } = await validateRequest()

		if (!currentUser) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await prisma.like.deleteMany({
			where: {
				userId: currentUser.id,
				postId
			}
		})
		return new Response()
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
