import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
	isLiked: boolean
	setIsLiked: (isLiked: boolean) => void
}

export const LikeButton = ({ isLiked, setIsLiked }: LikeButtonProps) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsLiked(!isLiked)}
						className={cn(
							'flex items-center gap-2',
							isLiked ?
								'text-destructive hover:text-destructive'
							:	'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
						)}
					>
						<Heart className={isLiked ? 'fill-current' : ''} size={16} />
						<span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom" align="start">
					Like
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default LikeButton
