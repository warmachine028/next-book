import type { CommentData } from '@/types'
import { UserTooltip } from '../users'
import { Avatar } from '@/components'
import Link from 'next/link'
import { formatRelativeDate } from '@/lib/utils'

interface CommentProps {
	comment: CommentData
}

const Comment = ({ comment }: CommentProps) => {
	return (
		<div className="flex gap-3 py-3">
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
		</div>
	)
}

export default Comment
