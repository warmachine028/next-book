'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { type DefaultStreamChatGenerics, useChatContext } from 'stream-chat-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession, useToast, useDebounce } from '@/hooks'
import { Check, Loader2, Search, X } from 'lucide-react'
import { Avatar, LoadingButton } from '@/components'
import type { UserResponse } from 'stream-chat'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useState } from 'react'

interface NewChatDialogProps {
	onOpenChange: (open: boolean) => void
	onChatCreated: () => void
}

const NewChatDialog = ({ onOpenChange, onChatCreated }: NewChatDialogProps) => {
	const { client, setActiveChannel } = useChatContext()
	const { toast } = useToast()
	const { user } = useSession()
	const [searchInput, setSearchInput] = useState('')
	const debouncedSearchInput = useDebounce(searchInput)

	const [selectedUsers, setSelectedUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>([])

	const { data, isFetching, isError, isSuccess, error } = useQuery({
		queryKey: ['stream-users', debouncedSearchInput],
		queryFn: async () =>
			client.queryUsers(
				{
					id: { $ne: user?.id },
					role: { $ne: 'admin' },
					...(debouncedSearchInput && {
						$or: [
							{ name: { $autocomplete: debouncedSearchInput } },
							{ username: { $autocomplete: debouncedSearchInput } }
						]
					})
				},
				{ name: 1, username: 1 },
				{ limit: 15 }
			)
	})

	const mutation = useMutation({
		mutationFn: async () => {
			const channel = client.channel('messaging', {
				members: [user?.id, ...selectedUsers.map((u) => u.id)],
				name:
					selectedUsers.length > 1 ?
						`${user.displayName}, ${selectedUsers.map((u) => u.name).join(', ')}`
					:	undefined
			})
			await channel.create()
			return channel
		},
		onSuccess: (channel) => {
			setActiveChannel(channel)
			onChatCreated()
		},
		onError: (error) => {
			console.error('Error starting chat', error)
			toast({
				title: 'Error starting chat. Please try again.',
				description: error.message,
				variant: 'destructive'
			})
		}
	})

	return (
		<Dialog open onOpenChange={onOpenChange}>
			<DialogContent className="bg-card p-0">
				<DialogHeader className="px-6 pt-6">
					<DialogTitle>New Chat</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4 px-6 pb-6">
					<div className="group relative">
						<Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
						<Input
							placeholder="Search users..."
							className="h-12 w-full px-14 pe-4 focus:outline-none"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>
					{!!selectedUsers.length && (
						<div className="mt-4 flex flex-wrap gap-2 p-2">
							{selectedUsers.map((user) => (
								<SelectedUserTag
									key={user.id}
									user={user}
									onRemove={() => setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))}
								/>
							))}
						</div>
					)}
					<hr />
					<div className="h-96 overflow-y-auto">
						{isSuccess &&
							data.users.map((user) => (
								<UserResult
									key={user.id}
									user={user}
									selected={selectedUsers.some((u) => u.id === user.id)}
									onClick={() => {
										setSelectedUsers((prev) =>
											prev.some((u) => u.id === user.id) ?
												prev.filter((u) => u.id !== user.id)
											:	[...prev, user]
										)
									}}
								/>
							))}
						{isSuccess && !data.users.length && (
							<p className="my-3 text-center text-muted-foreground">
								No users found. Try a different name.
							</p>
						)}
						{isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
						{isError && (
							<p className="my-3 text-center text-destructive">
								An error ocurred while loading users. {error.message}
							</p>
						)}
					</div>
				</div>
				<DialogFooter className="px-6 pb-6">
					<LoadingButton
						disabled={!selectedUsers.length}
						loading={mutation.isPending}
						onClick={() => mutation.mutate()}
					>
						Start Chat
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

interface UserResultProps {
	user: UserResponse<DefaultStreamChatGenerics>
	selected: boolean
	onClick: () => void
}

const UserResult = ({ user, selected, onClick }: UserResultProps) => {
	return (
		<Button
			className="flex min-h-16 w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
			onClick={onClick}
			variant="ghost"
		>
			<div className="flex items-center gap-2">
				<Avatar url={user.image} />
				<div className="flex flex-col text-start">
					<p className="font-bold">{user.name}</p>
					<p className="text-muted-foreground">@{user.username}</p>
				</div>
			</div>
			{selected && <Check className="size-5 text-success" />}
		</Button>
	)
}

interface SelectedUserTagProps {
	user: UserResponse<DefaultStreamChatGenerics>
	onRemove: () => void
}

const SelectedUserTag = ({ user, onRemove }: SelectedUserTagProps) => {
	return (
		<Button
			className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
			onClick={onRemove}
			variant="ghost"
		>
			<Avatar url={user.image} size={24} />
			<p className="font-bold">{user.name}</p>
			<X className="mx-2 size-5 text-muted-foreground" />
		</Button>
	)
}

export default NewChatDialog
