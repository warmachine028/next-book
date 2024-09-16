'use client'
import Link from 'next/link'
import fallbackIcon from '@/assets/avatar-placeholder.png'
import { PostData } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatRelativeDate } from '@/lib/utils'
import { useSession } from '@/hooks'
import PostMoreButton from './PostMoreButton'

interface PostProps {
	post: PostData
}

const Post = ({ post }: PostProps) => {
	const { user } = post
	const { user: currentUser } = useSession()
	return (
		<article className="group/post space-y-3 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-primary">
			<div className="flex justify-between gap-3">
				<div className="flex flex-wrap gap-3">
					<Avatar className="hidden xs:inline">
						<Link href={`users/${user.userName}`}>
							<AvatarImage src={user.avatarUrl || fallbackIcon.src} alt={user.userName} />
							<AvatarFallback>{user.displayName[0].toUpperCase()}</AvatarFallback>
						</Link>
					</Avatar>
					<Link href={`users/${user.userName}`} className="block font-medium hover:underline">
						{user.displayName}
					</Link>
					<Link href={`post/${post.id}`} className="block text-sm text-muted-foreground hover:underline">
						{formatRelativeDate(post.createdAt)}
					</Link>
				</div>
				{user.id === currentUser.id && (
					<PostMoreButton post={post} className={"opacity-0 transition-opacity group-hover/post:opacity-100"} />
				)}
			</div>
			<div className="whitespace-pre-line break-words">{post.content}</div>
		</article>
	)
}

Post.displayName = 'Post'
export default Post
