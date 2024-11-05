'use client'

import './styles.css'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { createPost } from './actions'
import { useSession, useMediaUpload } from '@/hooks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PlaceHolder from '@tiptap/extension-placeholder'
import fallbackIcon from '@/assets/avatar-placeholder.png'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSubmitPostMutation } from './mutations'
import LoadingButton from '@/components/LoadingButton'
import { useRef } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Attachment } from '@/hooks/useMediaUpload'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const PostEditor = () => {
	const { user } = useSession()
	const mutation = useSubmitPostMutation()
	const {
		attachments,
		isUploading,
		startUpload,
		removeAttachment,
		reset: resetMediaUpload,
		uploadProgress
	} = useMediaUpload()

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bold: false,
				italic: false
			}),
			PlaceHolder.configure({
				placeholder: "What's on your mind?"
			})
		],
		immediatelyRender: false
	})
	const { userName, displayName } = user
	const input = editor?.getText({ blockSeparator: '\n' }) || ''

	const onSubmit = async () => {
		mutation.mutate(
			{
				content: input,
				mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[]
			},
			{
				onSuccess: () => {
					editor?.commands.clearContent()
					resetMediaUpload()
				}
			}
		)
	}

	return (
		<div className="flex flex-col gap-5 bg-card p-5 shadow-sm">
			<div className="flex gap-5">
				<Avatar className="hidden xs:inline">
					<Link href={`users/${user.userName}`}>
						<AvatarImage src={user.avatarUrl || fallbackIcon.src} alt={userName} />
						<AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
					</Link>
				</Avatar>
				<EditorContent
					editor={editor}
					className="max-h-80 w-full overflow-y-auto rounded-md bg-accent px-5 py-3"
				/>
			</div>
			{!!attachments.length && (
				<AttachmentsPreviews attachments={attachments} removeAttachment={removeAttachment} />
			)}
			<div className="flex justify-end">
				{isUploading && (
					<>
						<span className="text-sm text-muted-foreground">{uploadProgress ?? 0}%</span>
						<Loader2 className="size-5 animate-spin text-primary" />
					</>
				)}
				<AddAttachmentButton onFilesSelected={startUpload} disabled={isUploading || attachments.length >= 5} />
				<LoadingButton
					loading={mutation.isPending}
					disabled={!input.trim() || isUploading}
					onClick={onSubmit}
					className="min-w-20"
				>
					Post
				</LoadingButton>
			</div>
		</div>
	)
}

interface AddAttachmentButtonProps {
	onFilesSelected: (files: File[]) => void
	disabled: boolean
}

const AddAttachmentButton = ({ onFilesSelected, disabled }: AddAttachmentButtonProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className="text-primary hover:text-primary"
				disabled={disabled}
				onClick={() => fileInputRef.current?.click()}
			>
				<ImageIcon size={20} />
			</Button>
			<Input
				type="file"
				accept="image/*, video/*"
				multiple
				ref={fileInputRef}
				hidden
				onChange={(e) => {
					const files = Array.from(e.target.files || [])
					if (files.length) {
						onFilesSelected(files)
						e.target.value = ''
					}
				}}
			/>
		</>
	)
}

interface AttachmentsPreviewsProps {
	attachments: Attachment[]
	removeAttachment: (fileName: string) => void
}

const AttachmentsPreviews = ({ attachments, removeAttachment }: AttachmentsPreviewsProps) => {
	return (
		<div className={cn('flex flex-wrap gap-3', attachments.length > 1 && 'sm:grid sm:grid-cols-2')}>
			{attachments.map((attachment) => (
				<AttachmentsPreview
					key={attachment.file.name}
					attachment={attachment}
					onRemove={() => removeAttachment(attachment.file.name)}
				/>
			))}
		</div>
	)
}

interface AttachmentsPreviewProps {
	attachment: Attachment
	onRemove: () => void
}

const AttachmentsPreview = ({ attachment: { file, mediaId, isUploading }, onRemove }: AttachmentsPreviewProps) => {
	const src = URL.createObjectURL(file)

	return (
		<div className={cn('relative, mx-auto, size-fit', isUploading && 'opacity-50')}>
			{file.type.startsWith('image') ?
				<Image
					src={src}
					alt="Attachments Preview"
					width={500}
					height={500}
					className="size-fit max-h-[30rem] rounded-2xl"
				/>
			:	<video controls className="size-fit max-h-[30rem] rounded-2xl">
					<source src={src} type={file.type} />
				</video>
			}
			{!isUploading && (
				<Button
					onClick={onRemove}
					variant="ghost"
					size="icon"
					className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
				>
					<X size={20} />
				</Button>
			)}
		</div>
	)
}

PostEditor.displayName = 'PostEditor'

export default PostEditor
