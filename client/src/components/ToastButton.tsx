'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { useToast } from '@/hooks'
import { ToastAction, ToastProps } from './ui/toast'

interface ToastButtonProps extends ButtonProps {
	toastProps?: ToastProps
}

const ToastButton = forwardRef<HTMLButtonElement, ToastButtonProps>(
	({ toastProps, disabled, className, variant, size, children, ...props }, ref) => {
		const { toast } = useToast()
		return (
			<Button
				className={cn(
					'flex h-10 w-full items-center justify-center rounded-full border border-solid border-primary bg-transparent px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-primary hover:text-foreground sm:h-12 sm:min-w-44 sm:px-5 sm:text-base',
					className
				)}
				type="button"
				ref={ref}
				{...props}
				onClick={() =>
					toast({
						title: 'Scheduled: Catch up ',
						description: 'Friday, February 10, 2023 at 5:57 PM',
						action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
						...toastProps
					})
				}
			>
				{children}
			</Button>
		)
	}
)
ToastButton.displayName = 'ToastButton'

export default ToastButton
