
import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { PostDataInclude } from '@/types'

export const GET = async () => {
	try {
		const { user } = await validateRequest()
		if (!user) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const posts = await prisma.post.findMany({
			include: PostDataInclude,
			orderBy: { createdAt: 'desc' },
			cacheStrategy: { ttl: 60 }
		})

		return Response.json(posts)
	} catch (error) {
		console.error(error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
