'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks'

interface DeleteDialogProps {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
}

export const DeleteDialog = ({ isOpen, setIsOpen }: DeleteDialogProps) => {
	const { toast } = useToast()
	const handleDelete = () => {
		toast({
			variant: 'destructive',
			title: 'Post Deleted',
			description: 'Your post has been successfully deleted.',
			duration: 3000
		})
		setIsOpen(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="rounded-md border border-gray-800 bg-black text-gray-100 shadow-lg shadow-gray-800/50">
				<DialogHeader>
					<DialogTitle>Confirm Deletion</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this post? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className="mt-4 flex justify-end space-x-2">
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleDelete}>
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
