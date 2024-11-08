'use client'
import Link from 'next/link'
import { PostData } from '@/types'
import { cn, formatRelativeDate } from '@/lib/utils'
import { useSession } from '@/hooks'
import PostMoreButton from './PostMoreButton'
import { Avatar, Linkify } from '@/components'
import { UserTooltip } from '../users'
import { Media } from '@prisma/client'
import Image from 'next/image'

interface PostProps {
	post: PostData
}

const Post = ({ post }: PostProps) => {
	const { user } = post
	const { user: currentUser } = useSession()
	return (
		<article className="group/post space-y-3 rounded-md bg-card p-5 shadow-sm">
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
			{!!post.attachments.length && <MediaPreviews attachments={post.attachments} />}
		</article>
	)
}

Post.displayName = 'Post'

interface MediaPreviewsProps {
	attachments: Media[]
}

const MediaPreviews = ({ attachments }: MediaPreviewsProps) => {
	return (
		<div className={cn('space-y-4', attachments.length < 2 ? 'columns-1' : 'md:columns-2')}>
			{attachments.map((media) => (
				<MediaPreview media={media} key={media.id} />
			))}
		</div>
	)
}

interface MediaPreviewProps {
	media: Media
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
	const mediaObject = {
		IMAGE: (
			<Image src={media.url} alt="attachment" width={500} height={500} className="size-fit w-full rounded-md" />
		),
		VIDEO: (
			<div className="aspect-video w-full rounded-md bg-muted">
				<video src={media.url} controls className="mx-auto size-fit max-w-[30rem] rounded-xl" />
			</div>
		)
	}
	return mediaObject[media.type] || <p className="text-destructive">Unsupported media type</p>
}

export default Post
