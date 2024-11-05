'use server'

import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation'
import { getUserDataSelect } from '@/types'

export const updateUserProfile = async (values: UpdateUserProfileValues) => {
	const validatedValues = updateUserProfileSchema.parse(values)

	const { user } = await validateRequest()

	if (!user) {
		throw new Error('Unauthorized')
	}
	return prisma.user.update({
		where: { id: user.id },
		data: validatedValues,
		select: getUserDataSelect(user.id)
	})
}
