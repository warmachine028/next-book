import { Button } from '@/components/ui/button'
import { MessageSquare, MessageSquareOff } from 'lucide-react'
import { PostData } from '@/types'
import { cn } from '@/lib/utils'
interface CommentButtonProps {
	post: PostData
	active: boolean
	onClick: () => void
}

const CommentButton = ({ post, onClick: handleClick, active }: CommentButtonProps) => {
	return (
		<Button
			variant="ghost"
			aria-label="View comments"
			onClick={handleClick}
			className={cn('flex items-center gap-2 text-sm font-medium tabular-nums')}
		>
			<div className="text-primary">
				{active ?
					<MessageSquare fill="currentColor" className="size-4" />
				:	<MessageSquare className="size-4" />}
			</div>
			<p>
				{post._count.comments} <span className="hidden sm:inline">comments</span>
			</p>
		</Button>
	)
}

export default CommentButton
