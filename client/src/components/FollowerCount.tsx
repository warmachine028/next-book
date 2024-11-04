'use client'
import { useFollowerInfo } from '@/hooks'
import { formatNumber } from '@/lib/utils'
import type { FollowerInfo } from '@/types'

interface FollowerCountProps {
	userId: string
	initialState: FollowerInfo
}

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
	const { data } = useFollowerInfo(userId, initialState)
	return (
		<span>
			Followers: <strong className="font-semibold">{formatNumber(data.followers)}</strong>
		</span>
	)
}

FollowerCount.displayName = 'FollowerCount'

export default FollowerCount
