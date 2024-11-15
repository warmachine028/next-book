import { type PostData } from '@/types'
import { Input } from '.'

interface CommentProps {
	post: PostData
}

const Comments = ({ post }: CommentProps) => {
	return (
		<div>
			<Input post={post} />
		</div>
	)
}

export default Comments
