'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import PlaceHolder from '@tiptap/extension-placeholder'
import { createPost } from './actions'
import { useSession } from '@/hooks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import fallbackIcon from '@/assets/avatar-placeholder.png'
import { Button } from '@/components/ui/button'
import './styles.css'
import Link from 'next/link'

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
	const { userName, displayName } = user
	const input = editor?.getText({ blockSeparator: '\n' }) || ''

	const onSubmit = async () => {
		await createPost(input)
		editor?.commands.clearContent()
	}

	return (
		<div className="bg-card ring-primary flex flex-col gap-5 rounded-2xl p-5 shadow-sm ring-1">
			<div className="flex gap-5">
				<Avatar className="xs:inline hidden">
					<Link href={`user/${user.userName}`}>
						<AvatarImage src={user.avatarUrl || fallbackIcon.src} alt={userName} />
						<AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
					</Link>
				</Avatar>
				<EditorContent
					editor={editor}
					className="bg-accent max-h-80 w-full overflow-y-auto rounded-md px-5 py-3"
				/>
			</div>
			<div className="flex justify-end">
				<Button disabled={!input.trim()} onClick={onSubmit} className="min-w-20">
					Post
				</Button>
			</div>
		</div>
	)
}

export default PostEditor
