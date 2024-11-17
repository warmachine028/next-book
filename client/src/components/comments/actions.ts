'use server'

import { PostData, getCommentDataInclude } from '@/types'
import { prisma } from '@/lib'
import { validateRequest } from '@/auth'
import { createCommentSchema } from '@/lib/validation'
import { NotificationType } from '@prisma/client'

export const createComment = async ({ post, content }: { post: PostData; content: string }) => {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Unauthorized: You are not logged in')
	}

	const { content: validatedContent } = createCommentSchema.parse({ content })
	const [comment] = await prisma.$transaction([
		prisma.comment.create({
			data: {
				content: validatedContent,
				authorId: user.id,
				postId: post.id
			},
			include: getCommentDataInclude(user.id)
		}),
		...(post.authorId !== user.id ?
			[
				prisma.notification.create({
					data: {
						isssuerId: user.id,
						recipientId: post.authorId,
						postId: post.id,
						type: NotificationType.COMMENT
					}
				})
			]
		:	[])
	])

	return comment
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
