'use server'

import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { createPostSchema } from '@/lib/validation'
import { getPostDataInclude } from '@/types'

export const createPost = async (input: {
	content: string
	mediaIds: string[]
}) => {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Unauthorized: You are not logged in')
	}
	const { content, mediaIds } = createPostSchema.parse(input)
	const post = await prisma.post.create({
		data: {
			content,
			authorId: user.id,
			attachments: {
				connect: mediaIds.map((id) => ({ id }))
			}
		},
		include: getPostDataInclude(user.id)
	})
	return post
}
