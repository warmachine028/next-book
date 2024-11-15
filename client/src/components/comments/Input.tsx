import { useCreateCommentMutation } from '@/hooks'
import type { PostData } from '@/types'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2, SendHorizonal } from 'lucide-react'

interface InputProps {
	post: PostData
}

const CommentInput = ({ post }: InputProps) => {
	const [input, setInput] = useState('')
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
			<Input placeholder="Add a comment..." value={input} onChange={handleChange} autoFocus />
			<Button type="submit" variant="ghost" size="icon" disabled={!input.trim() || isPending}>
				{isPending ?
					<Loader2 className="animate-spin" />
				:	<SendHorizonal />}
			</Button>
		</form>
	)
}

export default CommentInput
