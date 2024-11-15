import { kyInstance } from '@/lib/ky'
import type { FollowerInfo } from '@/types'
import { useQuery } from '@tanstack/react-query'

const useFollowerInfo = (userId: string, initialState: FollowerInfo) => {
	return useQuery({
		queryKey: ['follower-info', userId],
		queryFn: () => kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
		initialData: initialState,
		staleTime: Infinity
	})
}

export default useFollowerInfo
