import { PostData } from '@/types'
import { Suspense, useEffect, useState } from 'react'
import DeletePostDialog from './DeletePostDialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { CircleCheckBig, Info, Loader2, MoreHorizontal, Trash2, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface PostMoreButtonProps {
	post: PostData
	className?: string
}

const PostMoreButton = ({ post, className }: PostMoreButtonProps) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	return (
		<TooltipProvider>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost" className={cn(className, 'data-[state=open]:opacity-100')}>
						<MoreHorizontal className="size-5 text-muted-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<Tooltip>
						<TooltipTrigger asChild>
							<DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
								<span className="flex items-center gap-3 text-destructive">
									<Trash2 className="size-4" />
									Delete
								</span>
							</DropdownMenuItem>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>Delete action</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<DropdownMenuItem>
								<span className="text-success flex items-center gap-3">
									<CircleCheckBig className="size-4" />
									Success
								</span>
							</DropdownMenuItem>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>Success action</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<DropdownMenuItem>
								<span className="text-info flex items-center gap-3">
									<Info className="size-4" />
									Info
								</span>
							</DropdownMenuItem>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>Info action</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<DropdownMenuItem>
								<span className="flex items-center gap-3 text-warning">
									<TriangleAlert className="size-4" />
									Warning
								</span>
							</DropdownMenuItem>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>Warning action</p>
						</TooltipContent>
					</Tooltip>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeletePostDialog post={post} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
		</TooltipProvider>
	)
}

export default PostMoreButton
