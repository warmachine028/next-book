'use client'
import Link from 'next/link'
import fallbackIcon from '@/assets/avatar-placeholder.png'
import { PostData } from '@/types'
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatRelativeDate } from '@/lib/utils'
import { useSession } from '@/hooks'
import PostMoreButton from './PostMoreButton'
import Linkify from '../Linkify'
import Avatar from '../Avatar'
import { UserTooltip } from '../users'

interface PostProps {
	post: PostData
}

const Post = ({ post }: PostProps) => {
	const { user } = post
	const { user: currentUser } = useSession()
	return (
		<article className="group/post space-y-3 bg-card p-5 shadow-sm">
			<div className="flex justify-between gap-3">
				<div className="flex flex-wrap gap-3">
					<UserTooltip user={user}>
						<Link href={`/users/${user.userName}`}>
							<Avatar url={user.avatarUrl} />
						</Link>
					</UserTooltip>
					<div>
						<UserTooltip user={user}>
							<Link href={`users/${user.userName}`} className="block font-medium hover:underline">
								{user.displayName}
							</Link>
						</UserTooltip>
						<Link href={`post/${post.id}`} className="block text-sm text-muted-foreground hover:underline">
							{formatRelativeDate(post.createdAt)}
						</Link>
					</div>
				</div>
				{user.id === currentUser.id && (
					<PostMoreButton
						post={post}
						className={'opacity-0 transition-opacity group-hover/post:opacity-100'}
					/>
				)}
			</div>
			<Linkify>
				<div className="whitespace-pre-line break-words">{post.content}</div>
			</Linkify>
		</article>
	)
}

Post.displayName = 'Post'
export default Post
