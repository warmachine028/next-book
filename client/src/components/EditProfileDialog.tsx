'use client'

import Resizer from 'react-image-file-resizer'
import { UserData } from '@/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { useForm } from 'react-hook-form'
import { updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateProfileMutation } from '@/app/api/users/username/[username]/mutation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import LoadingButton from './LoadingButton'
import Image, { StaticImageData } from 'next/image'
import { useRef, useState } from 'react'
import { Label } from './ui/label'
import avatarPlaceholder from '@/assets/avatar-placeholder.png'
import { Camera } from 'lucide-react'
import CropImageDialog from './CropImageDialog'

interface EditProfileDialogProps {
	user: UserData
	open: boolean
	onOpenChange: (open: boolean) => void
}

const EditProfileDialog = ({ user, open, onOpenChange }: EditProfileDialogProps) => {
	const form = useForm<UpdateUserProfileValues>({
		resolver: zodResolver(updateUserProfileSchema),
		defaultValues: {
			displayName: user.displayName,
			bio: user.bio || ''
		}
	})
	const mutation = useUpdateProfileMutation()
	const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>()
	const avatarFile = croppedAvatar ? new File([croppedAvatar], `avatar_${user.id}.webp`) : undefined
	const handleSubmit = async (values: UpdateUserProfile1Values) => {
		mutation.mutate(
			{
				values,
				avatar: avatarFile
			},
			{
				onSuccess: () => {
					setCroppedAvatar(null)
					onOpenChange(false)
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-1.5">
					<Label>Avatar</Label>
					<AvatarInput
						src={croppedAvatar ? URL.createObjectURL(croppedAvatar) : user.avatarUrl || avatarPlaceholder}
						onImageCropped={setCroppedAvatar}
					/>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>DisplayName</FormLabel>
									<FormControl>
										<Input placeholder={user.displayName} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											placeholder="I am a basketball player 🏀"
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<LoadingButton type="submit" loading={mutation.isPending}>
								{mutation.isPending ? 'Saving ...' : 'Save'}
							</LoadingButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

EditProfileDialog.displayName = 'EditProfileDialog'

interface AvatarInputProps {
	src: string | StaticImageData
	onImageCropped: (blob: Blob | null) => void
}

const AvatarInput = ({ src, onImageCropped }: AvatarInputProps) => {
	const [image, setImage] = useState<File>()

	const fileInputRef = useRef<HTMLInputElement>(null)
	const onImageSelect = (image: File | undefined) => {
		if (!image) {
			return
		}
		Resizer.imageFileResizer(
			image, //
			1024,
			1024,
			'WEBP',
			100,
			0,
			(uri) => setImage(uri as File),
			'file'
		)
	}

	return (
		<>
			<Input
				type="file"
				accept="image/*"
				onChange={(e) => onImageSelect(e.target.files?.[0])}
				ref={fileInputRef}
				className="sr-only hidden"
			/>
			<Button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				className="group relative block h-full bg-inherit hover:bg-inherit"
			>
				<Image
					src={src}
					alt="avatar preview"
					className="float-none size-32 rounded-full object-cover"
					width={150}
					height={150}
				/>
				<span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
					<Camera size={24} />
				</span>
			</Button>
			{image && (
				<CropImageDialog
					src={URL.createObjectURL(image)}
					cropAspectRatio={1}
					onCropped={onImageCropped}
					onClose={() => {
						setImage(undefined)
						if (fileInputRef.current) {
							fileInputRef.current.value = ''
						}
					}}
				/>
			)}
		</>
	)
}

export default EditProfileDialog
