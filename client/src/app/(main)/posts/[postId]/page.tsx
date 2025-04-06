import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { getPostDataInclude, UserData } from '@/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache, Suspense } from 'react'
import { Avatar, FollowButton, Linkify, Menubar, Post } from '@/components'
import { UserTooltip } from '@/components/users'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface PageProps {
	params: Promise<{ postId: string }>
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
	const post = await prisma.post.findUnique({
		where: {
			id: postId
		},
		include: getPostDataInclude(loggedInUserId)
	})

	if (!post) {
		notFound()
	}
	return post
})

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const { postId } = await params
	const { user: currentUser } = await validateRequest()

	if (!currentUser) {
		return {}
	}

	const post = await getPost(postId, currentUser.id)

	return {
		title: `${post.author.userName}: ${post.content.slice(0, 50)}...`
	}
}

interface AuthorInfoSidebarProps {
	user: UserData
}

const AuthorInfoSidebar = async ({ user }: AuthorInfoSidebarProps) => {
	const { user: currentUser } = await validateRequest()
	// await new Promise((resolve) => setTimeout(resolve, 5000))
	if (!currentUser) {
		return null
	}

	return (
		<div className="bg-card space-y-5 rounded-md p-5 shadow-xs">
			<div className="text-xl font-bold">About the author</div>
			<UserTooltip user={user}>
				<Link href={`/users/${user.userName}`} className="flex items-center gap-3">
					<Avatar url={user.avatarUrl} className="flex-none" />
					<div className="">
						<p className="line-clamp-1 font-semibold break-all hover:underline">{user.displayName}</p>
						<p className="text-muted-foreground line-clamp-1 break-all">@{user.userName}</p>
					</div>
				</Link>
			</UserTooltip>
			<Linkify>
				<div className="text-muted-foreground line-clamp-6 break-words whitespace-pre-line">{user.bio}</div>
			</Linkify>
			{user.id !== currentUser.id && (
				<FollowButton
					userId={user.id}
					initialState={{
						followers: user._count.followers,
						isFollowedByUser: user.followers.some(({ followerId }) => followerId === currentUser.id)
					}}
				/>
			)}
		</div>
	)
}

const Page = async ({ params }: PageProps) => {
	const { postId } = await params
	const { user } = await validateRequest()

	if (!user) {
		return <p className="text-destructive">You&apos;re not authorized to view this page.</p>
	}
	const post = await getPost(postId, user.id)

	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="bg-card top-[5.25rem] hidden h-fit flex-none space-y-3 px-3 py-5 shadow-xs sm:block lg:px-5 xl:w-80" />
			<div className="w-full min-w-0 space-y-5">
				<Post post={post} />
			</div>
			<div className="top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
				<Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
					<AuthorInfoSidebar user={post.author} />
				</Suspense>
			</div>
		</main>
	)
}

export default Page
