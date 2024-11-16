'use server'

import { PostData, getCommentDataInclude } from '@/types'
import { prisma } from '@/lib'
import { validateRequest } from '@/auth'
import { createCommentSchema } from '@/lib/validation'

export const createComment = async ({ post, content }: { post: PostData; content: string }) => {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Unauthorized: You are not logged in')
	}

	const { content: validatedContent } = createCommentSchema.parse({ content })

	return prisma.comment.create({
		data: {
			content: validatedContent,
			authorId: user.id,
			postId: post.id
		},
		include: getCommentDataInclude(user.id)
	})
}

export const deleteComment = async (id: string) => {
	const { user } = await validateRequest()

	if (!user) {
		throw new Error('Unauthorized: You are not logged in')
	}

	const comment = await prisma.comment.findUnique({ where: { id } })

	if (!comment) {
		throw new Error('Comment not found')
	}
	if (comment.authorId !== user.id) {
		throw new Error('Unauthorized: You are not the author of this comment')
	}
	return prisma.comment.delete({
		where: { id },
		include: getCommentDataInclude(user.id)
	})
}
