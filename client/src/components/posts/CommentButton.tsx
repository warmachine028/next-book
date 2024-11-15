import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { PostData } from '@/types'

interface CommentButtonProps {
	post: PostData
	onClick: () => void
}

const CommentButton = ({ post, onClick: handleClick }: CommentButtonProps) => {
	return (
		<Button
			variant="ghost"
			aria-label="View comments"
			onClick={handleClick}
			className="flex items-center gap-2 text-sm font-medium tabular-nums"
		>
			<MessageSquare className="size-4" />
			<p>
				{post._count.comments} <span className="hidden sm:inline">comments</span>
			</p>
		</Button>
	)
}

export default CommentButton
