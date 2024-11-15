import type { CommentData } from '@/types'
import { UserTooltip } from '../users'
import { Avatar } from '@/components'
import Link from 'next/link'

interface CommentProps {
	comment: CommentData
}

const Comment = ({ comment }: CommentProps) => {
	return (
		<div className="flex gap-3 py-3">
			<span className="hidden sm:inline">
				<UserTooltip user={comment.author}>
					<Link href={`/users/${comment.author.userName}`}>
						<Avatar url={comment.author.avatarUrl} />
					</Link>
				</UserTooltip>

			</span>
			<div className="flex items-center">
				{comment.content}
			</div>
		</div>
	)
}

export default Comment
