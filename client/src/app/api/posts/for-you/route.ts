import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { PostDataInclude, PostsPage } from '@/types'
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
			include: PostDataInclude,
			orderBy: { createdAt: 'desc' },
			take: pageSize + 1,
			cursor: cursor ? { id: cursor } : undefined,
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