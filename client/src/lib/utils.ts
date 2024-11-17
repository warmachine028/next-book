import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDate, formatDistanceToNowStrict } from 'date-fns'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatNumber = (n: number): string =>
	Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1
	}).format(n)

export const formatRelativeDate = (from: Date) => {
	const currentDate = new Date()
	const diff = currentDate.getTime() - from.getTime()
	if (diff < 24 * 60 * 60 * 1000) {
		return formatDistanceToNowStrict(from, { addSuffix: true })
	} else if (currentDate.getFullYear() === from.getFullYear()) {
		return formatDate(from, 'MMM d')
	}
	return formatDate(from, 'MMM d, yyyy')
}

