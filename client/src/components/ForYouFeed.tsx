'use client'

import { PostData } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Post } from './posts'

const ForYouFeed = () => {
	const query = useQuery<PostData[]>({
		queryKey: ['post-feed', 'for-you'],
		queryFn: async () => {
			const result = await fetch('/api/posts/for-you')
			if (!result.ok) {
				throw new Error(`Request failed with status code ${result.status}`)
			}
			return result.json()
		}
	})
	if (query.status === 'pending') {
		return <Loader2 className="mx-auto animate-spin" />
	}

	if (query.status === 'error') {
		return <p className="text-center text-destructive">An error ocurred while loading posts</p>
	}

	return (
		<div className="space-y-5">
			{query.data.map((post) => (
				<Post key={post.id} post={post} />
			))}
		</div>
	)
}

ForYouFeed.displayName = 'ForYouFeed'

export default ForYouFeed
