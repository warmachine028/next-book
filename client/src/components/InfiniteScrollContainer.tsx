'use client'

import { PropsWithChildren } from 'react'
import { useInView } from 'react-intersection-observer'

interface InfiniteScrollContainerProps extends PropsWithChildren {
	onBottomReached: () => void
	className?: string
}

const InfiniteScrollContainer = ({ children, onBottomReached, className }: InfiniteScrollContainerProps) => {
	const { ref } = useInView({
		rootMargin: '200px',
		onChange: (inView) => inView && onBottomReached()
	})
	return (
		<div className={className}>
			{children}
			<div ref={ref}></div>
		</div>
	)
}

InfiniteScrollContainer.displayName = 'InfiniteScrollContainer'
export default InfiniteScrollContainer
