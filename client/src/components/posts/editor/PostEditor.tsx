'use client'

import './styles.css'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import PlaceHolder from '@tiptap/extension-placeholder'
import Link from 'next/link'
import Image from 'next/image'
import { useCreatePostMutation, useSession, useMediaUpload } from '@/hooks'
import type { Attachment } from '@/hooks/useMediaUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingButton, Avatar } from '@/components'
import { ClipboardEvent, useRef } from 'react'
import { ImageIcon, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDropzone } from '@uploadthing/react'

const PostEditor = () => {
	const { user } = useSession()
	const mutation = useCreatePostMutation()
	const {
		attachments,
		isUploading,
		startUpload,
		removeAttachment,
		reset: resetMediaUpload,
		uploadProgress
	} = useMediaUpload()

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: startUpload
	})
	const { onClick, ...rootProps } = getRootProps()

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
	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		const files = Array.from(e.clipboardData.items)
			.filter((item) => item.kind === 'file')
			.map((item) => item.getAsFile()) as File[]
		startUpload(files)
	}

	return (
		<div className="flex flex-col gap-5 rounded-md bg-card p-5 shadow-sm">
			<div className="flex items-center gap-2">
				<Link href={`/users/${user.userName}`} className="hidden sm:inline">
					<Avatar url={user.avatarUrl} size={38} />
				</Link>
				<div {...rootProps} className="flex-1">
					<EditorContent
						editor={editor}
						className={cn(
							'max-h-80 w-full overflow-y-auto rounded-md bg-accent px-5 py-3',
							isDragActive && 'outline-dashed outline-1 outline-primary'
						)}
						onPaste={handlePaste}
					/>
					<Input {...getInputProps()} />
				</div>
			</div>
			{!!attachments.length && (
				<AttachmentsPreviews attachments={attachments} removeAttachment={removeAttachment} />
			)}
			<div className="flex items-center justify-end gap-3">
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
				title='attachment'
			>
				<ImageIcon size={20} />
			</Button>
			<Input
				type="file"
				accept="image/*, video/*"
				multiple
				ref={fileInputRef}
				hidden
				className="sr-only hidden"
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
				<AttachmentPreview
					key={attachment.file.name}
					attachment={attachment}
					onRemove={() => removeAttachment(attachment.file.name)}
				/>
			))}
		</div>
	)
}

interface AttachmentPreviewProps {
	attachment: Attachment
	onRemove: () => void
}

const AttachmentPreview = ({ attachment: { file, isUploading }, onRemove }: AttachmentPreviewProps) => {
	const src = URL.createObjectURL(file)

	return (
		<div className={cn('mx-auto, relative size-fit', isUploading && 'opacity-50')}>
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
					className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-muted"
				>
					<X size={20} />
				</Button>
			)}
		</div>
	)
}

PostEditor.displayName = 'PostEditor'

export default PostEditor
