import { Skeleton } from '@/components/ui/skeleton'

export const LoadingSkeletonGroup = () => {
	return (
		<div className="space-y-5">
			{[1, 2, 3].map((i) => (
				<LoadingSkeleton key={i} />
			))}
		</div>
	)
}

LoadingSkeletonGroup.displayName = 'LoadingSkeletonGroup'

const LoadingSkeleton = () => {
	return (
		<div className="w-full animate-pulse space-y-3 bg-card p-5 shadow-sm ring-1 ring-muted">
			<div className="flex flex-wrap gap-3">
				<Skeleton className="size-12 rounded-full" />
				<div className="space-y-1.5">
					<Skeleton className="h-4 w-32 rounded" />
					<Skeleton className="h-4 w-20 rounded" />
				</div>
			</div>
			<Skeleton className="h-16 rounded" />
		</div>
	)
}

LoadingSkeleton.displayName = 'LoadingSkeleton'

export default LoadingSkeleton
