'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PostData } from '@/types'
import { cn, formatRelativeDate } from '@/lib/utils'
import { useSession } from '@/hooks'
import { Avatar, Linkify } from '@/components'
import { UserTooltip } from '../users'
import { Comments } from '../comments'
import { Media } from '@prisma/client'
import { LikeButton, BookmarkButton, PostMoreButton, CommentButton } from '.'
import { useState } from 'react'

interface PostProps {
	post: PostData
}

const Post = ({ post }: PostProps) => {
	const { author } = post
	const { user: currentUser } = useSession()
	const [showComments, setShowComments] = useState(false)

	return (
		<article className="group/post space-y-3 rounded-md bg-card p-5 shadow-sm">
			<div className="flex justify-between gap-3">
				<div className="flex flex-wrap gap-3">
					<UserTooltip user={author}>
						<Link href={`/users/${author.userName}`}>
							<Avatar url={author.avatarUrl} />
						</Link>
					</UserTooltip>
					<div>
						<UserTooltip user={author}>
							<Link href={`/users/${author.userName}`} className="block font-medium hover:underline">
								{author.displayName}
							</Link>
						</UserTooltip>
						<Link
							suppressHydrationWarning
							href={`/posts/${post.id}`}
							className="block text-sm text-muted-foreground hover:underline"
						>
							{formatRelativeDate(post.createdAt)}
						</Link>
					</div>
				</div>
				{author.id === currentUser.id && (
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
			<hr />
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center">
					<LikeButton
						postId={post.id}
						initialState={{
							likes: post._count.likes,
							isLikedByUser: post.likes.some((like) => like.userId === currentUser.id)
						}}
					/>
					<CommentButton post={post} onClick={() => setShowComments(!showComments)} active={showComments} />
				</div>
				<BookmarkButton
					postId={post.id}
					initialState={{
						isBookmarkedByUser: post.bookmarks.some((bookmark) => bookmark.userId === currentUser.id)
					}}
				/>
			</div>
			{showComments && <Comments post={post} />}
		</article>
	)
}

Post.displayName = 'Post'

interface MediaPreviewsProps {
	attachments: Media[]
}

const MediaPreviews = ({ attachments }: MediaPreviewsProps) => {
	return (
		<div className={cn('space-y-4', attachments.length < 2 ? 'columns-1' : 'xl:columns-2')}>
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
			<div className="relative aspect-[16/9] w-full">
				<Image
					src={media.url}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					className="size-fit h-auto w-full rounded-md object-cover"
					alt="attachment"
				/>
			</div>
		),
		VIDEO: (
			<div className="aspect-video w-full rounded-md bg-muted">
				<video src={media.url} controls className="mx-auto size-fit max-w-[30rem] rounded-md" />
			</div>
		)
	}
	return mediaObject[media.type] || <p className="text-destructive">Unsupported media type</p>
}

export default Post
