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
import { cn } from '@/lib/utils'

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
	const handleSubmit = async (values: UpdateUserProfileValues) => {
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
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<div className="space-y-2">
							<Label>Avatar</Label>
							<AvatarInput
								src={
									croppedAvatar ?
										URL.createObjectURL(croppedAvatar)
									:	user.avatarUrl || avatarPlaceholder
								}
								onImageCropped={setCroppedAvatar}
							/>
						</div>
						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Name</FormLabel>
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
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<LoadingButton type="submit" loading={mutation.isPending}>
								{mutation.isPending ? 'Saving ...' : 'Save Changes'}
							</LoadingButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

interface AvatarInputProps {
	src: string | StaticImageData
	onImageCropped: (blob: Blob | null) => void
}

const AvatarInput = ({ src, onImageCropped }: AvatarInputProps) => {
	const [image, setImage] = useState<File>()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const onImageSelect = (image: File | undefined) => {
		if (!image) return
		Resizer.imageFileResizer(image, 1024, 1024, 'WEBP', 100, 0, (uri) => setImage(uri as File), 'file')
	}

	return (
		<>
			<Input
				type="file"
				accept="image/*"
				onChange={(e) => onImageSelect(e.target.files?.[0])}
				ref={fileInputRef}
				className="sr-only"
			/>
			<div className="flex items-center space-x-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => fileInputRef.current?.click()}
					className="relative overflow-hidden rounded-full p-0 h-auto"
				>
					<Image
						src={src}
						alt="avatar preview"
						className="size-32 rounded-full object-cover transition-opacity duration-300 hover:opacity-75"
						width={150}
						height={150}
					/>
					<span className="absolute inset-0 flex items-center justify-center bg-black bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100">
						<Camera className="h-6 w-6 text-white" />
					</span>
				</Button>
			</div>
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

EditProfileDialog.displayName = 'EditProfileDialog'

export default EditProfileDialog
