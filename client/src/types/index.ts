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
export interface CommentsPage {
	comments: CommentData[]
	previousCursor: string | null
}
export interface NotificationsPage {
	notifications: NotificationData[]
	nextCursor: string | null
}

export const getCommentDataInclude = (userId: string) => {
	return {
		author: {
			select: getUserDataSelect(userId)
		}
	} satisfies Prisma.CommentInclude
}

export type CommentData = Prisma.CommentGetPayload<{
	include: ReturnType<typeof getCommentDataInclude>
}>

export interface FollowerInfo {
	followers: number
	isFollowedByUser: boolean
}

export interface LikeInfo {
	likes: number
	isLikedByUser: boolean
}

export const getNotificationDataInclude = () => {
	return {
		issuer: {
			select: {
				userName: true,
				displayName: true,
				avatarUrl: true
			}
		},
		post: {
			select: {
				content: true
			}
		}
	} satisfies Prisma.NotificationInclude
}

export const getPostDataInclude = (userId: string) => {
	return {
		author: {
			select: getUserDataSelect(userId)
		},
		attachments: true,
		likes: {
			where: {
				userId: userId
			},
			select: {
				userId: true
			}
		},
		bookmarks: {
			where: {
				userId: userId
			},
			select: {
				userId: true
			}
		},
		_count: {
			select: {
				likes: true,
				comments: true
			}
		}
	} satisfies Prisma.PostInclude
}

export interface BookmarkInfo {
	isBookmarkedByUser: boolean
}

export interface NotificationUnreadCountInfo {
	unreadCount: number
}

export type NotificationData = Prisma.NotificationGetPayload<{
	include: ReturnType<typeof getNotificationDataInclude>
}>

export type PostData = Prisma.PostGetPayload<{ include: ReturnType<typeof getPostDataInclude> }>

export type UserData = Prisma.UserGetPayload<{ select: ReturnType<typeof getUserDataSelect> }>
