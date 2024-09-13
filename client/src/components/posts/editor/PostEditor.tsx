'use client'

import './styles.css'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { createPost } from './actions'
import { useSession } from '@/hooks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PlaceHolder from '@tiptap/extension-placeholder'
import fallbackIcon from '@/assets/avatar-placeholder.png'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSubmitPostMutation } from './mutations'
import LoadingButton from '@/components/LoadingButton'

const PostEditor = () => {
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
	const { user } = useSession()
	const mutation = useSubmitPostMutation()
	const { userName, displayName } = user
	const input = editor?.getText({ blockSeparator: '\n' }) || ''

	const onSubmit = async () => {
		mutation.mutate(input, {
			onSuccess: () => editor?.commands.clearContent()
		})
	}

	return (
		<div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-primary">
			<div className="flex gap-5">
				<Avatar className="hidden xs:inline">
					<Link href={`user/${user.userName}`}>
						<AvatarImage src={user.avatarUrl || fallbackIcon.src} alt={userName} />
						<AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
					</Link>
				</Avatar>
				<EditorContent
					editor={editor}
					className="max-h-80 w-full overflow-y-auto rounded-md bg-accent px-5 py-3"
				/>
			</div>
			<div className="flex justify-end">
				<LoadingButton loading={mutation.isPending} disabled={!input.trim()} onClick={onSubmit} className="min-w-20">
					Post
				</LoadingButton>
			</div>
		</div>
	)
}

PostEditor.displayName = 'PostEditor'

export default PostEditor
