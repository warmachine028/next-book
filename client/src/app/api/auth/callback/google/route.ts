import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { google, lucia } from '@/auth'
import { kyInstance, prisma, slugify, streamServerClient } from '@/lib'
import { generateIdFromEntropySize } from 'lucia'
import { OAuth2RequestError } from 'arctic'

export const GET = async (req: NextRequest) => {
	const code = req.nextUrl.searchParams.get('code')
	const state = req.nextUrl.searchParams.get('state')
	const sessionCookie = await cookies()

	const storedState = sessionCookie.get('state')?.value
	const codeVerifier = sessionCookie.get('code_verifier')?.value

	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
		return new Response(null, { status: 400 })
	}
	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier)
		const googleUser = await kyInstance
			.get('https://www.googleapis.com/oauth2/v1/userinfo', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			})
			.json<{ id: string; name: string }>()

		const existingUser = await prisma.user.findUnique({
			where: {
				googleId: googleUser.id
			}
		})
		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {})
			const cookie = lucia.createSessionCookie(session.id)
			sessionCookie.set(cookie.name, cookie.value, cookie.attributes)
			return new Response(null, { status: 302, headers: { Location: '/' } })
		}
		const userId = generateIdFromEntropySize(10)
		const userName = `${slugify(googleUser.name)}-${userId.slice(0, 4)}`
		await prisma.$transaction(async (tx) => {
			await tx.user.create({
				data: {
					id: userId,
					userName,
					displayName: googleUser.name,
					googleId: googleUser.id
				}
			})
			await streamServerClient.upsertUser({
				id: userId,
				userName,
				name: userName
			})
		})
		const { id } = await lucia.createSession(userId, {})
		const { name, value, attributes } = lucia.createSessionCookie(id)

		sessionCookie.set(name, value, attributes)
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		})
	} catch (error) {
		console.error(error)
		if (error instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			})
		}
		return new Response(null, {
			status: 500
		})
	}
}
