'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSession, useToast } from '@/hooks'
import { Bookmark, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { cn, formatRelativeDate } from '@/lib/utils'

import { UserTooltip } from '@/components/users'
import { Avatar } from '@/components'
import { LikeButton, ShareDialog, MoreButton } from '.'

interface Media {
	type: 'image' | 'video'
	url: string
}

interface PostProps {
	id: string
	title: string
	content: string
	media: Media[]
	createdAt: Date
	isLiked: boolean
	isBookmarked: boolean
}

const Post = ({ post }: { post: PostProps }) => {
	const [editedPost, setEditedPost] = useState(post)
	const [isEditing, setIsEditing] = useState(false)
	const { user } = useSession()
	const { toast } = useToast()

	const handleEdit = () => {
		if (isEditing) {
			setIsEditing(false)
			toast({
				variant: 'success',
				title: 'Edit Successful',
				description: 'Your post has been updated.',
				duration: 3000
			})
		} else {
			setIsEditing(true)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setEditedPost({ ...editedPost, [e.target.name]: e.target.value })
	}

	const handleAddMedia = () => {
		if (editedPost.media.length < 5) {
			setEditedPost({
				...editedPost,
				media: [
					...editedPost.media,
					{
						type: 'image',
						url: `https://picsum.photos/id/${970 + editedPost.media.length}/800/400`
					}
				]
			})
		}
	}
	const handleBookmark = () => {
		setEditedPost({ ...editedPost, isBookmarked: !editedPost.isBookmarked })
	}
	const handleLike = () => {
		setEditedPost({ ...editedPost, isLiked: !editedPost.isLiked })
	}
	const handleRemoveMedia = (index: number) => {
		setEditedPost({
			...editedPost,
			media: editedPost.media.filter((_, i) => i !== index)
		})
	}
	const author = {
		...user,
		createdAt: new Date(),
		bio: null,
		followers: [],
		_count: { posts: 0, followers: 0 }
	}

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Card className="w-full max-w-md flex-none overflow-hidden rounded-md">
				<CardHeader className="flex flex-row items-center gap-4">
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
					<div className="ml-auto flex items-center gap-2">
						{editedPost.isBookmarked && (
							<Bookmark className="text-info" aria-label="Bookmarked" size={20} />
						)}
						<MoreButton
							handleEdit={handleEdit}
							isEditing={isEditing}
							handleBookmark={handleBookmark}
							isBookmarked={editedPost.isBookmarked}
						/>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{isEditing ?
						<Input
							name="title"
							value={editedPost.title}
							onChange={handleChange}
							className="text-lg font-bold"
						/>
					:	<h2 className="text-lg font-bold">{post.title}</h2>}
					<div className={`grid ${editedPost.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
						{editedPost.media.map((item, index) => (
							<div key={index} className={cn('relative', editedPost.media.length === 1 && 'col-span-2')}>
								{item.type === 'image' ?
									<img
										src={item.url}
										width={800}
										height={400}
										alt={`Media ${index + 1}`}
										className={`w-full ${editedPost.media.length === 1 ? 'h-64' : 'h-32'} rounded-md object-cover`}
									/>
								:	<video
										src={item.url}
										className={`w-full ${editedPost.media.length === 1 ? 'h-64' : 'h-32'} rounded-md object-cover`}
										controls
									/>
								}
								{isEditing && (
									<Button
										onClick={() => handleRemoveMedia(index)}
										className="absolute right-1 top-1 size-7 rounded-full bg-destructive"
										variant="ghost"
										size="icon"
									>
										<X size={16} />
									</Button>
								)}
							</div>
						))}
						{isEditing && editedPost.media.length < 5 && (
							<Button
								onClick={handleAddMedia}
								variant="ghost"
								className={cn(
									'col-span-2 border-2 border-dashed border-muted',
									editedPost.media.length ? 'h-32' : 'col-span-2 h-64'
								)}
							>
								<Plus />
							</Button>
						)}
					</div>
					{isEditing ?
						<Textarea name="content" value={editedPost.content} onChange={handleChange} />
					:	<p className="text-sm text-muted-foreground sm:text-base">{editedPost.content}</p>}
				</CardContent>
				<CardFooter className="flex justify-between">
					<LikeButton isLiked={editedPost.isLiked} setIsLiked={handleLike} />
					<ShareDialog />
				</CardFooter>
			</Card>
		</motion.div>
	)
}

export default Post
