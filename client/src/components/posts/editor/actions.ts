'use server'

import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { createPostSchema } from '@/lib/validation'

export const createPost = async (input: string) => {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Unauthorized: You are not logged in')
	}
    const { content } = createPostSchema.parse({ content: input })
    await prisma.post.create({
        data: { 
            content,
            authorId: user.id
        }
    })
    
}
