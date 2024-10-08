'use client'

import { logInSchema, LogInValues } from '@/lib/validation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'
import { logIn } from './actions'
import { PasswordInput, LoadingButton } from '@/components'

const LogIn = () => {
	const [error, setError] = useState<string>()
	const [isPending, startTransition] = useTransition()

	const form = useForm<LogInValues>({
		resolver: zodResolver(logInSchema),
		defaultValues: { userName: '', password: '' }
	})
	const onSubmit = async (values: LogInValues) => {
		setError(undefined)
		startTransition(async () => {
			const { error } = await logIn(values)
			setError(error)
		})
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
				<p className="text-center text-destructive">{error}</p>
				<FormField
					control={form.control}
					name="userName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input autoComplete="username" placeholder="eg: pritamKunduC24" {...field} />
							</FormControl>
							<FormMessage />
							<FormDescription />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<PasswordInput
									autoComplete="new-password"
									placeholder="eg: 1@$abShadC23"
									type="password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
							<FormDescription />
						</FormItem>
					)}
				/>
				<LoadingButton type="submit" className="w-full" loading={isPending}>
					Login Now
				</LoadingButton>
			</form>
		</Form>
	)
}

LogIn.displayName = 'LogInForm'

export default LogIn
