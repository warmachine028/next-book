'use client'

import { useState } from 'react'
import type { UserData } from '@/types'
import { Button } from '@/components/ui/button'
import EditProfileDialog from './EditProfileDialog'

interface EditProfileButtonProps {
	user: UserData
}

const EditProfileButton = ({ user }: EditProfileButtonProps) => {
	const [showDialog, setShowDialog] = useState(false)

	return (
		<>
			<Button variant="outline" onClick={() => setShowDialog(true)}>
				Edit Profile
			</Button>
			<EditProfileDialog //
				user={user}
				open={showDialog}
				onOpenChange={setShowDialog}
			/>
		</>
	)
}

EditProfileButton.displayName = 'EditProfileButton'

export default EditProfileButton
