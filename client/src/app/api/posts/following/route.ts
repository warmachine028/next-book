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
		const posts = await prisma.post.findMany({
			where: {
				author: {
					followers: { some: { followerId: user.id } }
				}
			},
			orderBy: { createdAt: 'desc' },
			take: pageSize + 1,
			cursor: cursor ? { id: cursor } : undefined,
			include: getPostDataInclude(user.id),
			cacheStrategy: { ttl: 60 }
		})
		const nextCursor = posts.length > pageSize ? posts[pageSize].id : null
		const data: PostsPage = { posts: posts.slice(0, pageSize), nextCursor }

		return Response.json(data)
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
