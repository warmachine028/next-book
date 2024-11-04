'use client'

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { PropsWithChildren } from 'react'
import type { UserData, FollowerInfo } from '@/types'
import { useSession } from '@/hooks'
import { FollowButton, Avatar, Linkify, FollowerCount } from '@/components'
import Link from 'next/link'

interface UserTooltipProps extends PropsWithChildren {
	user: UserData
}

const UserTooltip = ({ children, user }: UserTooltipProps) => {
	const { user: loggedInUser } = useSession()
	const followerState: FollowerInfo = {
		followers: user._count.followers,
		isFollowedByUser: !!user.followers.some(({ followerId }) => followerId === loggedInUser.id)
	}
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>
					<div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
						<div className="flex items-center justify-center gap-2">
							<Link href={`/users/${user.userName}`}>
								<Avatar size={70} url={user.avatarUrl} />
							</Link>
							{loggedInUser.id !== user.id && (
								<FollowButton userId={user.id} initialState={followerState} />
							)}
						</div>
						<div>
							<Link href={`/users/${user.userName}`}>
								<div className="text-lg font-semibold hover:underline">{user.displayName}</div>
								<div className="text-sm text-muted-foreground">@{user.userName}</div>
							</Link>
						</div>
						<Linkify>
							<div className="line-clamp-4 whitespace-pre-line">{user.bio}</div>
						</Linkify>
						<FollowerCount userId={user.id} initialState={followerState} />
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

UserTooltip.displayName = 'UserTooltip'

export default UserTooltip
