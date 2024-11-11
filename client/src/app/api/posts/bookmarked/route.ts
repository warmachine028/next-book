import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { getPostDataInclude, PostsPage } from '@/types'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
	try {
		const cursor = req.nextUrl.searchParams.get('cursor') || undefined
		const pageSize = 10
		const { user } = await validateRequest()

		if (!user) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const bookmarks = await prisma.bookmark.findMany({
			where: { userId: user.id },
			include: { post: { include: getPostDataInclude(user.id) } },
			orderBy: { createdAt: 'desc' },
			take: pageSize + 1,
			cursor: cursor ? { id: cursor } : undefined,
			cacheStrategy: { ttl: 60 }
		})
		const nextCursor = bookmarks.length > pageSize ? bookmarks[pageSize].id : null
		const data: PostsPage = {
			posts: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.post),
			nextCursor
		}

		return Response.json(data)
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
