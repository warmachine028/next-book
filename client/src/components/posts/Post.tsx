import { PostData } from '@/types'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import fallbackIcon from '@/assets/avatar-placeholder.png'
import { formatRelativeDate } from '@/lib'

interface PostProps {
	post: PostData
}

const Post = ({ post }: PostProps) => {
	const { user } = post
	return (
		<article className="space-y-3 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-primary">
			<div className="flex flex-wrap gap-3">
				<Avatar className="hidden xs:inline">
					<Link href={`user/${user.userName}`}>
						<AvatarImage src={user.avatarUrl || fallbackIcon.src} alt={user.userName} />
						<AvatarFallback>{user.displayName[0].toUpperCase()}</AvatarFallback>
					</Link>
				</Avatar>
				<Link href={`user/${user.userName}`} className="block font-medium hover:underline">
					{user.displayName}
				</Link>
				<Link href={`post/${post.id}`} className="block text-sm text-muted-foreground hover:underline">
					{/* {formatRelativeDate(post.createdAt)} */}
				</Link>
			</div>
			<div className="whitespace-pre-line break-words">{post.content}</div>
		</article>
	)
}

export default Post
