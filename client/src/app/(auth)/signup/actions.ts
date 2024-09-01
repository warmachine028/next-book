'use server'

import { lucia } from '@/auth'
import prisma from '@/lib/prisma'
import { signupSchema, SignUpValues } from '@/lib/validation'
import { hash } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUp = async (credentials: SignUpValues): Promise<{ error: string }> => {
	try {
		const { userName, email, password } = signupSchema.parse(credentials)
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		})
		const userId = generateIdFromEntropySize(10)

		const exixtingUserName = await prisma.user.findFirst({
			where: {
				userName: {
					equals: userName,
					mode: 'insensitive'
				}
			}
		})
		if (exixtingUserName) {
			return { error: 'Username already taken' }
		}
		const exixtingEmail = await prisma.user.findFirst({
			where: {
				email: {
					equals: email,
					mode: 'insensitive'
				}
			}
		})
		if (exixtingEmail) {
			return { error: 'Email already in use' }
		}
		await prisma.user.create({
			data: {
				id: userId,
				userName,
				displayName: userName,
				email,
				passwordHash
			}
		})
		const { id } = await lucia.createSession(userId, {})
		const { name, value, attributes } = lucia.createSessionCookie(id)
		cookies().set(name, value, attributes)
		return redirect('/')
	} catch (error) {
		if (isRedirectError(error)) {
			throw error
		}
		console.error(error)
		return { error: 'Something went wrong. Please try again later homes.' }
	}
}
