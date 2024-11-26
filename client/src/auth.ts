import { Lucia, Session, User } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { prisma } from '@/lib'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { Google } from 'arctic'

const adapter = new PrismaAdapter(prisma.session, prisma.user)

interface DatabaseUserAttributes {
	id: string
	userName: string
	displayName: string
	avatarUrl: string | null
	googleId: string | null
}

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: { secure: process.env.NODE_ENV === 'production' }
	},
	getUserAttributes({ id, userName, displayName, avatarUrl, googleId }: DatabaseUserAttributes) {
		return {
			id,
			userName,
			displayName,
			avatarUrl,
			googleId
		}
	}
})

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const cookieStore = await cookies()
		const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null
		if (!sessionId) {
			return {
				user: null,
				session: null
			}
		}
		const result = await lucia.validateSession(sessionId)
		try {
			if (result.session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id)
				const { name, value, attributes } = sessionCookie
				cookieStore.set(name, value, attributes)
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie()
				const { name, value, attributes } = sessionCookie
				cookieStore.set(name, value, attributes)
			}
		} catch (error) {
			console.error(error)
		}
		return result
	}
)

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}
