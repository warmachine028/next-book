import { Prisma } from '@prisma/client'

export const getUserDataSelect = (userId: string) => {
	return {
		id: true,
		userName: true,
		displayName: true,
		avatarUrl: true,
		bio: true,
		createdAt: true,
		followers: {
			where: {
				followerId: userId
			},
			select: {
				followerId: true
			}
		},
		_count: {
			select: {
				posts: true,
				followers: true
			}
		}
	} satisfies Prisma.UserSelect
}

export interface PostsPage {
	posts: PostData[]
	nextCursor: string | null
}

export interface FollowerInfo {
	followers: number
	isFollowedByUser: boolean
}
export const getPostDataInclude = (userId: string) => {
	return {
		user: {
			select: getUserDataSelect(userId)
		}
	} satisfies Prisma.PostInclude
}

export type PostData = Prisma.PostGetPayload<{ include: ReturnType<typeof getPostDataInclude> }>

export type UserData = Prisma.UserGetPayload<{ select: ReturnType<typeof getUserDataSelect> }>
