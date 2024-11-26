'use server'

import { lucia } from '@/auth'
import { prisma } from '@/lib'
import { logInSchema, LogInValues } from '@/lib/validation'
import { verify } from '@node-rs/argon2'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const logIn = async (credentials: LogInValues): Promise<{ error: string }> => {
	try {
		const { userName, password } = logInSchema.parse(credentials)
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
		const cookieStore = await cookies()
		const { id: userId } = existingUser
		const { id } = await lucia.createSession(userId, {})
		const { name, value, attributes } = lucia.createSessionCookie(id)
		cookieStore.set(name, value, attributes)
		try {
			return redirect('/')
		} catch (redirectError) {
			console.error('Redirect error:', redirectError)
			return { error: '' }
		}
	} catch (error) {
		console.error(error)
		return { error: 'Something went wrong. Please try again later homes.' }
	}
}
