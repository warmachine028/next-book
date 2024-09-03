'use client'

import { useSession } from '@/hooks'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Avatar from './Avatar'
import Link from 'next/link'
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from 'lucide-react'
import { logOut } from '@/app/(auth)/actions'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

export interface UserButtonProps {
	className?: string
}

const UserButton = ({ className }: UserButtonProps) => {
	const {
		user: { userName, avatarUrl }
	} = useSession()
	const { theme, setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className={cn('flex-none rounded-full', className)}>
					<Avatar url={avatarUrl} size={40} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Logged in as @{userName}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href={`/user/${userName}`}>
					<DropdownMenuItem className="cursor-pointer">
						<UserIcon className="mr-2 size-4" /> <span>Profile</span>
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className="cursor-pointer">
						<Monitor className="mr-2 size-4" />
						<span>Theme</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
								<Sun className="mr-2 size-4" />
								<span>Light</span>
								{theme === 'light' && <Check className="ml-auto size-4" />}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
								<Moon className="mr-2 size-4" />
								<span>Dark</span>
								{theme === 'dark' && <Check className="ml-auto size-4" />}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
								<Monitor className="mr-2 size-4" />
								<span>System</span>
								{theme === 'system' && <Check className="ml-auto size-4" />}
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="hover:bg-destructive cursor-pointer"
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