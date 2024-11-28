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
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useUpdatePostMutation } from '@/hooks'
import { Button } from '../ui/button'

interface PostProps {
	post: PostData
}

const Post = ({ post }: PostProps) => {
	const { author } = post
	const { user: currentUser } = useSession()
	const [showComments, setShowComments] = useState(false)
	const [editing, setEditing] = useState(false)

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
						setEditing={setEditing}
						className={'opacity-0 transition-opacity group-hover/post:opacity-100'}
					/>
				)}
			</div>
			{editing ?
				<UpdatePostForm post={post} setEditing={setEditing} />
			:	<Linkify>
					<div className="whitespace-pre-line break-words">{post.content}</div>
				</Linkify>
			}
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

interface UpdatePostFormProps extends PostProps {
	setEditing: (editing: boolean) => void
}
const UpdatePostForm = ({ post, setEditing }: UpdatePostFormProps) => {
	const { mutate: updatePost } = useUpdatePostMutation()
	const editor = useEditor({
		content: post.content,
		extensions: [
			StarterKit.configure({ bold: false, italic: false }),
			Placeholder.configure({
				placeholder: "What's on your mind?"
			})
		],
		immediatelyRender: true
	})
	const content = editor?.getText({ blockSeparator: '\n' }) || ''
	const handleSubmit = () => {
		updatePost({ id: post.id, data: { ...post, content } })
		setEditing(false)
	}
	return (
		<div className="flex-1 flex-col gap-2">
			<EditorContent editor={editor} className="max-h-80 w-full overflow-y-auto rounded-md bg-accent px-5 py-3" />
			<div className="my-2 space-x-2">
				<Button onClick={handleSubmit}>Update</Button>
				<Button variant="destructive" onClick={() => setEditing(false)}>
					Cancel
				</Button>
			</div>
		</div>
	)
}

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
	const handleMediaError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => {
		e.currentTarget.classList.add('hidden')
		const fallbackDiv = document.createElement('div')
		fallbackDiv.className = 'flex items-center justify-center h-48 bg-muted rounded-md'
		fallbackDiv.innerText = 'Media failed to load'
		e.currentTarget.parentNode?.appendChild(fallbackDiv)
	}

	const mediaObject = {
		IMAGE: (
			<div className="relative w-full overflow-hidden rounded-md">
				<img
					src={media.url}
					alt="Post attachment"
					className="object-cover"
					width="100%"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					onError={handleMediaError}
				/>
			</div>
		),
		VIDEO: (
			<div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
				<video src={media.url} controls className="h-full w-full" onError={handleMediaError} />
			</div>
		)
	}
	return (
		mediaObject[media.type] || (
			<p className="flex h-48 items-center justify-center rounded-md bg-muted text-destructive">
				Unsupported media type
			</p>
		)
	)
}

export default Post
