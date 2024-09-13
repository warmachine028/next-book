'use server'

import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { createPostSchema } from '@/lib/validation'
import { PostDataInclude } from '@/types'

export const createPost = async (input: string) => {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Unauthorized: You are not logged in')
	}
    const { content } = createPostSchema.parse({ content: input })
    const post = await prisma.post.create({
        data: { 
            content,
            authorId: user.id
        },
        include: PostDataInclude,
    })
    return post
}
