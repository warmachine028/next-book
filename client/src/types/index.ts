import { Prisma } from '@prisma/client'

export interface PostsPage {
	posts: PostData[]
	nextCursor: string | null
}

export const UserDataSelect = {
	id: true,
	userName: true,
	displayName: true,
	avatarUrl: true
} satisfies Prisma.UserSelect

export const PostDataInclude = {
	user: { select: UserDataSelect }
} satisfies Prisma.PostInclude

export type PostData = Prisma.PostGetPayload<{ include: typeof PostDataInclude }>
