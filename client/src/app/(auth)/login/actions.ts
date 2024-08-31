'use server'

import { lucia } from '@/auth'
import prisma from '@/lib/prisma'
import { loginSchema, LoginValues } from '@/lib/validation'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { verify } from '@node-rs/argon2'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const login = async (credentials: LoginValues): Promise<{ error: string }> => {
	try {
		const { userName, password } = loginSchema.parse(credentials)

		const existingUser = await prisma.user.findFirst({
			where: {
				userName: {
					equals: userName,
					mode: 'insensitive'
				}
			}
		})

		if (!existingUser || !existingUser?.passwordHash) {
			return { error: 'Invalid username or password' }
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		})

		if (!validPassword) {
			return { error: 'Invalid username or password' }
		}
		const { id: userId } = existingUser
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
