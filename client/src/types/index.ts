import { Prisma } from '@prisma/client'

export const PostDataInclude = {
	user: {
		select: {
			userName: true,
			displayName: true,
			avatarUrl: true
		}
	}
} satisfies Prisma.PostInclude

export type PostData = Prisma.PostGetPayload<{ include: typeof PostDataInclude }>
