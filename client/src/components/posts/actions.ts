'use server'

import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { getPostDataInclude } from '@/types'

export const deletePost = async (id: string) => {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Unauthorized: You are not logged in')
	}
	const post = await prisma.post.findUnique({ where: { id } })
	if (!post) {
		throw new Error('Post not found.')
	}
	if (post.authorId !== user.id) {
		throw new Error('Unauthorized')
	}
	const deletedPost = await prisma.post.delete({ where: { id }, include: getPostDataInclude(user.id) })
	return deletedPost
}
