'use client'

import { signUpSchema, SignUpValues } from '@/lib/validation'
import { useForm, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'
import { signUp } from '@/app/(auth)/signup/actions'
import { LoadingButton, PasswordInput } from '@/components'

const SignUpForm = () => {
	const [error, setError] = useState<string>()
	const [isPending, startTransition] = useTransition()

	const form = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: { userName: '', email: '', password: '' }
	})

	const onSubmit = async (values: SignUpValues) => {
		setError(undefined)
		startTransition(async () => {
			const { error } = await signUp(values)
			if (error) {
				setError(error)
			}
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
				<p className="text-destructive text-center">{error}</p>
				<FormField
					control={form.control}
					name="userName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input autoComplete="username" placeholder="eg: pritamKunduC24" {...field} />
							</FormControl>
							{useFormState().errors.userName ? (
								<FormMessage />
							) : (
								<FormDescription>This is your permanent public display name.</FormDescription>
							)}
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									autoComplete="email"
									placeholder="eg: pritam.kundu@email.com"
									type="email"
									{...field}
								/>
							</FormControl>
							{useFormState().errors.email ? (
								<FormMessage />
							) : (
								<FormDescription>You can change your email later.</FormDescription>
							)}
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
							{useFormState().errors.password ? (
								<FormMessage />
							) : (
								<FormDescription>Choose a strong 8 character Password.</FormDescription>
							)}
						</FormItem>
					)}
				/>
				<LoadingButton type="submit" className="w-full" loading={isPending}>
					Create account
				</LoadingButton>
			</form>
		</Form>
	)
}

export default SignUpForm
