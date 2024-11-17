'use client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit2, Save, Trash2, Bookmark } from 'lucide-react'
import { DeleteDialog } from './DeleteDialog'
import { useState } from 'react'
import { cn } from '@/lib/utils'
interface MoreButtonProps {
	handleEdit: () => void
	handleBookmark: () => void
	isEditing: boolean
	isBookmarked: boolean
}

export const MoreButton = ({ handleEdit, handleBookmark, isEditing, isBookmarked }: MoreButtonProps) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)

	return (
		<TooltipProvider>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={handleEdit}>
						{isEditing ?
							<Save className="mr-2" size={16} />
						:	<Edit2 className="mr-2" size={16} />}
						{isEditing ? 'Save' : 'Edit'}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
						<Trash2 className="mr-2" size={16} />
						Delete
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleBookmark}>
						<Bookmark className={cn('mr-2 fill-current', isBookmarked && 'text-blue-500')} size={16} />
						{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteDialog isOpen={showDeleteDialog} setIsOpen={setShowDeleteDialog} />
		</TooltipProvider>
	)
}
export default MoreButton
