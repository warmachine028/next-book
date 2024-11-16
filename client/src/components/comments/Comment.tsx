import type { CommentData } from '@/types'
import Link from 'next/link'
import { UserTooltip } from '../users'
import { Avatar } from '@/components'
import { formatRelativeDate } from '@/lib/utils'
import { useSession } from '@/hooks'
import { CommentMoreButton } from '.'

interface CommentProps {
	comment: CommentData
}

const Comment = ({ comment }: CommentProps) => {
	const { user } = useSession()

	return (
		<div className="group/comment flex gap-3 py-3">
			<span className="hidden sm:inline">
				<UserTooltip user={comment.author}>
					<Link href={`/users/${comment.author.userName}`}>
						<Avatar url={comment.author.avatarUrl} size={38} />
					</Link>
				</UserTooltip>
			</span>
			<div>
				<div className="flex items-center gap-1 text-sm">
					<UserTooltip user={comment.author}>
						<Link href={`/users/${comment.author.userName}`} className="font-medium hover:underline">
							{comment.author.displayName}
						</Link>
					</UserTooltip>
					<span className="text-muted-foreground">{formatRelativeDate(comment.createdAt)}</span>
				</div>
				<p>{comment.content}</p>
			</div>
			{comment.authorId === user.id && (
				<CommentMoreButton
					comment={comment}
					className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
				/>
			)}
		</div>
	)
}

Comment.displayName = 'Comment'

export default Comment
