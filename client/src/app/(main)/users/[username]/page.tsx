import { validateRequest } from '@/auth'
import {
	Avatar,
	FollowButton,
	FollowerCount,
	Linkify,
	Menubar,
	TrendsSidebar,
	UserPostsFeed,
	EditProfileButton
} from '@/components'
import { prisma } from '@/lib'
import { formatNumber } from '@/lib/utils'
import { type FollowerInfo, getUserDataSelect, type UserData } from '@/types'
import { formatDate } from 'date-fns'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

interface PageProps {
	params: Promise<{ username: string }>
}

const getUser = cache(async (username: string, userId: string) => {
	const user = await prisma.user.findFirst({
		where: {
			userName: {
				equals: username,
				mode: 'insensitive'
			}
		},
		select: getUserDataSelect(userId)
	})

	if (!user) {
		notFound()
	}
	return user
})

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const { username } = await params
	const { user: currentUser } = await validateRequest()

	if (!currentUser) {
		return {}
	}

	const user = await getUser(username, currentUser.id)

	return {
		title: `${user.displayName} (@${user.userName})`
	}
}

interface UserProfileProps {
	user: UserData
	currentUserId: string
}

const UserProfile = async ({ user, currentUserId }: UserProfileProps) => {
	const followerInfo: FollowerInfo = {
		followers: user._count.followers,
		isFollowedByUser: user.followers.some(({ followerId }) => followerId === currentUserId)
	}

	return (
		<section className="bg-card h-fit w-full space-y-5 p-5 shadow-xs">
			<Avatar url={user.avatarUrl} size={250} className="mx-auto size-full max-h-60 max-w-60 rounded-full" />
			<div className="flex flex-wrap gap-3 sm:flex-nowrap">
				<div className="me-auto space-y-3">
					<div>
						<h1 className="text-3xl font-bold">{user.displayName}</h1>
						<div className="text-muted-foreground">@{user.userName}</div>
					</div>
					<p>Member since {formatDate(user.createdAt, 'MMM d, yyy')}</p>
					<div className="flex items-center gap-3">
						<span>
							Posts: <strong className="font-semibold">{formatNumber(user._count.posts)}</strong>{' '}
						</span>
						<FollowerCount userId={user.id} initialState={followerInfo} />
					</div>
				</div>
				{user.id === currentUserId ?
					<EditProfileButton user={user} />
				:	<FollowButton userId={user.id} initialState={followerInfo} />}
			</div>
			<hr className="h-3" />
			<Linkify>{user.bio || 'User does not have a bio yet'}</Linkify>
		</section>
	)
}

const Page = async ({ params }: PageProps) => {
	const { username } = await params
	const { user: currentUser } = await validateRequest()

	if (!currentUser) {
		return <p className="text-destructive">You&apos;re not authorized to view this page.</p>
	}

	const user = await getUser(username, currentUser.id)

	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="bg-card top-[5.25rem] hidden h-fit flex-none space-y-3 px-3 py-5 shadow-xs sm:block lg:px-5 xl:w-80" />
			<div className="flex w-full min-w-0 gap-5">
				<div className="w-full min-w-0 space-y-5">
					<UserProfile user={user} currentUserId={currentUser.id} />
					<div className="bg-card p-5 shadow-xs">
						<h2 className="text-center text-2xl font-bold">{user.displayName}&apos;s posts</h2>
					</div>
					<UserPostsFeed userId={user.id} />
				</div>
				<TrendsSidebar />
			</div>
		</main>
	)
}

export default Page
