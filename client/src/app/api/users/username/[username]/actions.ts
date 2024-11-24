'use server'

import { validateRequest } from '@/auth'
import { prisma, streamServerClient } from '@/lib'
import { updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation'
import { getUserDataSelect } from '@/types'

export const updateUserProfile = async (values: UpdateUserProfileValues) => {
	const validatedValues = updateUserProfileSchema.parse(values)

	const { user } = await validateRequest()

	if (!user) {
		throw new Error('Unauthorized')
	}

	return prisma.$transaction(async (tx) => {
		const updatedUser = await tx.user.update({
			where: { id: user.id },
			data: validatedValues,
			select: getUserDataSelect(user.id)
		})
		await streamServerClient.partialUpdateUser({
			id: user.id,
			set: { name: validatedValues.displayName }
		})
		return updatedUser
	})
}
