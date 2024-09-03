import Image from 'next/image'
import placeHolder from '@/assets/avatar-placeholder.png'
import { cn } from '@/lib/utils'

interface AvatarProps {
	url: string | undefined | null
	size?: number
	className?: string
}

const Avatar = ({ url, size = 48, className }: AvatarProps) => {
	return (
		<Image
			src={url || placeHolder}
			alt="user-avatar"
			width={size}
			height={size}
			className={cn('bg-secondary aspect-square h-fit flex-none rounded-full object-cover', className)}
		/>
	)
}

Avatar.displayName = 'Avatar'

export default Avatar
