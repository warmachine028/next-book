import { z } from 'zod'

const isRequired = z.string().trim().min(1, 'Required')

export const signUpSchema = z.object({
	email: isRequired.email('required'),
	userName: isRequired.regex(/^[a-zA-Z0-9_-]+$/, 'Only alphanumeric characters, - and _ allowed'),
	password: isRequired.min(8, 'Must be at least 8 characters')
	// confirmPassword: isRequired.min(8, 'Must match password')
})
export const logInSchema = z.object({
	userName: isRequired,
	password: isRequired
})

export const createPostSchema = z.object({
	content: isRequired
})



export type SignUpValues = z.infer<typeof signUpSchema>
export type LogInValues = z.infer<typeof logInSchema>
