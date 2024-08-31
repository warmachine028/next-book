import { z } from 'zod'

const isRequired = z.string().trim().min(1, 'Required')

export const signupSchema = z.object({
	email: isRequired.email('required'),
	userName: isRequired.regex(/^[a-zA-Z0-9_-]+$/, 'Only lphanumeric characters, - and _ allowed'),
	password: isRequired.min(8, 'Must be at least 8 characters'),
	confirmPassword: z.string().min(6)
})
export const loginSchema = z.object({
	userName: isRequired,
	password: isRequired
})

export type SignupValues = z.infer<typeof signupSchema>
export type LoginValues = z.infer<typeof loginSchema>
