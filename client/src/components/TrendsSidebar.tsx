'use server'

import { validateRequest } from '@/auth'
import { prisma } from '@/lib'
import { UserDataSelect } from '@/types'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'
import Avatar from './Avatar'
import { Button } from './ui/button'
import { unstable_cache } from 'next/cache'
import { formatNumber } from '@/lib/utils'

const getTrendingTopics = unstable_cache(
	//
	async () => {
		const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
			SELECT 
				LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) hashtag, 
				COUNT(*) count
			FROM posts
			GROUP BY hashtag
			ORDER BY count DESC, hashtag ASC
			LIMIT 5
		`
		return await result.map((row) => ({
			hashtag: row.hashtag,
			count: Number(row.count)
		}))
	},
	['trending_topics'],
	{
		revalidate: 3 * 60 * 60 // 3 hrs
	}
)
const TrendingTopics = async () => {
	const trendingTopics = await getTrendingTopics()
	return (
		<div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-primary">
			<div className="text-xl font-bold">Trending Topics</div>
			{trendingTopics.map(({ hashtag, count }) => {
				const title = hashtag.split('#')[1]
				return (	
					<Link href={`/hashtag/${title}`} className="block" key={title}>
						<p className="line-clamp-1 break-all font-semibold hover:underline" title={hashtag}>
							{hashtag}
						</p>
						<p className="line-clamp-1 break-all text-sm text-muted-foreground">
							{formatNumber(count)} {count === 1 ? 'post' : 'posts'}
						</p>
						<div className="flex items-center justify-between gap-3" key={hashtag}></div>
					</Link>
				)
			})}
		</div>
	)
}

const WhoToFollow = async () => {
	// await new Promise((resolve) => setTimeout(resolve, 3000))
	const { user } = await validateRequest()
	if (!user) {
		return
	}

	const usersToFollow = await prisma.user.findMany({
		where: {
			NOT: {
				id: user.id
			}
		},
		select: UserDataSelect,
		take: 5
	})
	return (
		<div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-primary">
			<div className="text-xl font-bold">Who to Follow</div>
			{usersToFollow.map((user) => (
				<div className="flex items-center justify-between gap-3" key={user.id}>
					<Link href={`/user/${user.userName}`} className="flex items-center justify-between gap-3">
						<Avatar url={user.avatarUrl} className="flex-none" />
						<div>
							<p className="line-clamp-1 break-all font-semibold hover:underline">{user.displayName}</p>
							<p className="line-clamp-1 break-all text-muted-foreground">@{user.userName}</p>
						</div>
					</Link>
					<Button>Follow</Button>
				</div>
			))}
		</div>
	)
}

const TrendsSidebar = () => {
	return (
		<aside className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
			<Suspense fallback={<Loader2 className="mx-auto h-10 w-10 animate-spin" />}>
				<WhoToFollow />
				<TrendingTopics />
			</Suspense>
		</aside>
	)
}

TrendsSidebar.displayName = 'TrendsSidebar'

export default TrendsSidebar
