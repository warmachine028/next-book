'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger
} from '@/components/ui/dialog'
import {
	IconBrandFacebook as Facebook,
	IconBrandLinkedin as Linkedin,
	IconBrandInstagram as Instagram,
	IconBrandX as X,
	IconBrandWhatsapp
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Share2, Link } from 'lucide-react'
import { useToast } from '@/hooks'
import { useState } from 'react'
import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const ShareDialog = () => {
	const [open, setOpen] = useState(false)
	const { toast } = useToast()
	const handleShare = () => {
		setOpen(false)
		toast({
			variant: 'info',
			title: 'Link copied to clipboard',
			description: 'You can now share this link with your friends!'
		})
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setOpen(true)}
								className="flex items-center gap-2 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
							>
								<Share2 size={16} />
								<span className="hidden sm:inline">Share</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" align="start">
							Share
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</DialogTrigger>
			<DialogContent className="rounded-md border border-gray-800 bg-black text-gray-100 shadow-lg shadow-gray-800/50">
				<DialogHeader>
					<DialogTitle>Share this post</DialogTitle>
					<DialogDescription>Choose a platform to share this amazing content!</DialogDescription>
				</DialogHeader>
				<div className="mt-4 flex justify-center space-x-4">
					<Button
						variant="outline"
						size="icon"
						className="rounded-full border-info text-info"
						onClick={handleShare}
					>
						<Facebook size={16} />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="rounded-full border-primary-foreground"
						onClick={handleShare}
					>
						<X size={16} />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="rounded-full border-pink-500 text-pink-500"
						onClick={handleShare}
					>
						<Instagram size={24} />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="rounded-full border-blue-400 text-blue-400"
						onClick={handleShare}
					>
						<Linkedin size={24} />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="rounded-full border-success text-success"
						onClick={handleShare}
					>
						<IconBrandWhatsapp size={24} />
					</Button>
				</div>
				<Button
					variant="secondary"
					className="flex w-full items-center justify-center gap-2 rounded-md"
					onClick={handleShare}
				>
					<Link size={16} />
					Copy Link
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default ShareDialog
