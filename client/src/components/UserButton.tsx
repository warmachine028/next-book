'use client'

import { useSession } from '@/hooks'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Avatar from './Avatar'
import Link from 'next/link'
import { LogOutIcon, UserIcon } from 'lucide-react'
import { logOut } from '@/app/(auth)/actions'
import { cn } from '@/lib/utils'

export interface UserButtonProps {
	className?: string
}

const UserButton = ({ className }: UserButtonProps) => {
	const { user } = useSession()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className={cn('flex-none rounded-full',className)}>
					<Avatar url={user.avatarUrl} size={40} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Logged in as @{user.userName}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href={`/user/${user.userName}`}>
					<DropdownMenuItem className="cursor-pointer">
						<UserIcon className="mr-2 size-4" /> <span>Profile</span>
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						logOut()
					}}
				>
					<LogOutIcon className="mr-2 size-4" /> <span>Logout</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

UserButton.displayName = 'UserButton'

export default UserButton
