'use client'

import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { useState, forwardRef } from 'react'
import { Input, type InputProps } from '@/components/ui/input'

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	const [showPassword, setShowPassword] = useState(false)
	return (
		<div className="relative">
			<Input
				type={showPassword ? 'text' : 'password'}
				className={cn('pe-10', className)}
				ref={ref}
				{...props}
				suppressHydrationWarning
			/>
			<button
				type="button"
				title={showPassword ? 'Hide password' : 'Show password'}
				className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 transform"
				onClick={() => setShowPassword(!showPassword)}
			>
				{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
			</button>
		</div>
	)
})

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
