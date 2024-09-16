'use client'
import { useFollowerInfo } from '@/hooks'
import { formatNumber } from '@/lib/utils'
import { FollowerInfo } from '@/types'

interface FollowerCountProps {
	userId: string
	initalState: FollowerInfo
}

const FollowerCount = ({ userId, initalState }: FollowerCountProps) => {
	const { data } = useFollowerInfo(userId, initalState)
	return (
		<span>
			Followers: <strong className="font-semibold">{formatNumber(data.followers)}</strong>
		</span>
	)
}

FollowerCount.displayName = 'FollowerCount'

export default FollowerCount
