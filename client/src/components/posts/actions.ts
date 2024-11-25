'use server'

import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { getPostDataInclude, type PostData } from '@/types'

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
	return prisma.post.delete({
		where: { id },
		include: getPostDataInclude(user.id)
	})
}

export const updatePost = async ({ id, data }: { id: string; data: PostData }) => {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Unauthorized: You are not logged in')
	}

	const post = await prisma.post.findUnique({ where: { id } })
	if (!post) {
		throw new Error('Post not found')
	}
	if (post.authorId !== user.id) {
		throw new Error('Unauthorized')
	}
	return prisma.post.update({
		where: { id },
		data: { content: data.content },
		include: getPostDataInclude(user.id)
	})
}
