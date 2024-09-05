'use client'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

const AlertButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ disabled, className, variant, size, children, ...props }, ref) => {
		return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						className={cn(
							'border-primary hover:bg-primary hover:text-foreground flex h-10 w-full items-center justify-center rounded-full border border-solid bg-transparent px-4 text-sm font-medium transition-colors hover:border-transparent sm:h-12 sm:min-w-44 sm:px-5 sm:text-base',
							className
						)}
						type="button"
						ref={ref}
						{...props}
					>
						{children}
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>https://next-book-15.vercel.app says</AlertDialogTitle>
						<AlertDialogDescription>Hello from next book!</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction className="px-7">OK</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)
	}
)
AlertButton.displayName = 'AlertButton'

export default AlertButton
