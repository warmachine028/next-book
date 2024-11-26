import { google } from '@/auth'
import { generateCodeVerifier, generateState } from 'arctic'
import { cookies } from 'next/headers'

export const GET = async () => {
	const state = generateState()
	const codeVerifier = generateCodeVerifier()

	const url = google.createAuthorizationURL(state, codeVerifier, ['profile', 'email'])
	const sessionCookie = await cookies()
	sessionCookie.set('state', state, {
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	})
	sessionCookie.set('code_verifier', codeVerifier, {
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	})

	return Response.redirect(url)
}
