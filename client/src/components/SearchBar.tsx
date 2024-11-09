'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { Input } from './ui/input'
import { SearchIcon } from 'lucide-react'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'

const suggestions = [
	'🐶 dogs',
	'🐈 cats',
	'🍗 food',
	'👩‍💻 coding',
	'✈️ travelling Vlogs',
	'cute puppies',
	'💒 weddings',
	'🧑 people'
]

const SearchInput = ({
	className = '',
	onSearch,
	autoFocus = false
}: {
	className?: string
	onSearch?: (query: string) => void
	autoFocus?: boolean
}) => {
	const [currentSuggestion, setCurrentSuggestion] = useState(suggestions[0])
	const [nextSuggestion, setNextSuggestion] = useState(suggestions[1])
	const [isAnimating, setIsAnimating] = useState(false)
	const [query, setQuery] = useState('')
	const [isFocused, setIsFocused] = useState(false)

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null
		if (!isFocused && query === '') {
			interval = setInterval(() => {
				setIsAnimating(true)
				setTimeout(() => {
					setCurrentSuggestion(nextSuggestion)
					setNextSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
					setIsAnimating(false)
				}, 500)
			}, 3000)
		}
		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isFocused, query, nextSuggestion])

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const searchQuery = query.trim() || undefined

		if (!searchQuery) {
			return
		}

		if (onSearch) {
			onSearch(searchQuery)
		}
		setQuery('')
	}

	return (
		<form onSubmit={handleSubmit} action="/search" className={`cursor-pointer ${className}`}>
			<div className="relative text-sm">
				<Input
					name="query"
					value={query}
					className="pe-10"
					onChange={(event) => setQuery(event.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					autoFocus={autoFocus}
				/>
				<div
					className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform"
					aria-hidden="true"
				>
					<div className="relative h-5 w-48 overflow-hidden">
						{!isFocused && query === '' && (
							<>
								<span
									className={`absolute left-0 transition-all duration-500 ease-in-out ${
										isAnimating ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
									}`}
								>
									Search for {currentSuggestion}
								</span>
								<span
									className={`absolute left-0 transition-all duration-500 ease-in-out ${
										isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
									}`}
								>
									Search for {nextSuggestion}
								</span>
							</>
						)}
					</div>
				</div>
				<Button
					className="absolute right-0 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:bg-transparent"
					type="submit"
					title="Search"
					variant="ghost"
				>
					<SearchIcon className="size-5" />
				</Button>
			</div>
		</form>
	)
}

interface SearchDialogProps {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	onSearch: (query: string) => void
}

const SearchDialog = ({ isOpen, setIsOpen, onSearch: handleSearch }: SearchDialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
					<SearchIcon className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Search</DialogTitle>
					<DialogDescription>Search for posts, users, and more</DialogDescription>
				</DialogHeader>
				<SearchInput className="w-full" onSearch={handleSearch} autoFocus={true} />
			</DialogContent>
		</Dialog>
	)
}

const SearchBar = () => {
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(false)

	const handleSearch = (query: string) => {
		router.push(`/search?q=${encodeURIComponent(query)}`)
		setIsOpen(false)
	}

	return (
		<>
			<div className="hidden sm:block">
				<SearchInput className="w-64" onSearch={handleSearch} />
			</div>
			<div className="sm:hidden">
				<SearchDialog isOpen={isOpen} setIsOpen={setIsOpen} onSearch={handleSearch} />
			</div>
		</>
	)
}

SearchBar.displayName = 'SearchBar'

export default SearchBar
