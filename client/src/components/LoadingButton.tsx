import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export interface LoadingButtonProps extends ButtonProps {
	loading: boolean
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
	({ loading, disabled, className, variant, size, ...props }, ref) => {
		return (
			<Button
				disabled={loading || disabled}
				className={cn('flex items-center gap-2', className)}
				ref={ref}
				{...props}
			>
				{loading && <Loader2 className="size-5 animate-spin" />}
				{props.children}
			</Button>
		)
	}
)
LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
