import { useCreateCommentMutation, useSession } from '@/hooks'
import type { PostData } from '@/types'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2, SendHorizonal } from 'lucide-react'
import { Avatar } from '@/components'
import Link from 'next/link'

interface InputProps {
	post: PostData
}

const CommentInput = ({ post }: InputProps) => {
	const [input, setInput] = useState('')
	const { user } = useSession()
	const { mutate: createComment, isPending } = useCreateCommentMutation(post.id)
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (!input) {
			return
		}
		createComment({ post, content: input }, { onSuccess: () => setInput('') })
	}
	return (
		<form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
			<Link href={`/users/${user.userName}`} className="hidden sm:inline">
				<Avatar url={user.avatarUrl} />
			</Link>
			<Input placeholder="Add a comment..." value={input} onChange={handleChange} autoFocus />
			<Button type="submit" variant="ghost" size="icon" disabled={!input.trim() || isPending}>
				{isPending ?
					<Loader2 className="animate-spin" />
				:	<SendHorizonal className="text-primary" />}
			</Button>
		</form>
	)
}

export default CommentInput
