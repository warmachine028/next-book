import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { BookmarkInfo } from '@/types'
import { NextRequest } from 'next/server'

export const GET = async (_: NextRequest, { params }: { params: Promise<{ postId: string }> }) => {
	try {
		const { postId } = await params
		const { user: currentUser } = await validateRequest()

		if (!currentUser) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const bookmarks = await prisma.bookmark.findUnique({
			where: {
				userId_postId: {
					userId: currentUser.id,
					postId
				}
			}
		})

		const data: BookmarkInfo = {
			isBookmarkedByUser: !!bookmarks
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

		await prisma.bookmark.upsert({
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

		await prisma.bookmark.deleteMany({
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
