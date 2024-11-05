import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { createUploadthing, FileRouter } from 'uploadthing/next'
import { UploadThingError, UTApi } from 'uploadthing/server'

const f = createUploadthing()

export const fileRouter = {
	avatar: f({
		image: { maxFileSize: '512KB' }
	})
		.middleware(async () => {
			const { user } = await validateRequest()

			if (!user) {
				throw new UploadThingError('Unauthorized')
			}
			return { user }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const oldAvatarUrl = metadata.user.avatarUrl
			if (oldAvatarUrl) {
				const key = oldAvatarUrl.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]
				await new UTApi().deleteFiles(key)
			}
			const avatarUrl = file.url.replace(
				'/f/', //
				`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
			)
			await prisma.user.update({
				where: { id: metadata.user.id },
				data: {
					avatarUrl
				}
			})
			return { avatarUrl }
		}),
	attachment: f({
		image: { maxFileSize: '4MB', maxFileCount: 5 },
		video: { maxFileSize: '64MB', maxFileCount: 1 }
	})
		.middleware(async () => {
			const { user } = await validateRequest()
			if (!user) {
				throw new UploadThingError('Unauthorized')
			}
			return {}
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const media = await prisma.media.create({
				data: {
					url: file.url.replace(
						'/f/', //
						`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
					),
					type: file.type === 'image' ? 'IMAGE' : 'VIDEO'
				}
			})
			return { mediaId: media.id }
		})
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter
