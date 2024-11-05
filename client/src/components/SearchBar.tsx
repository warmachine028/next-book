'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { Input } from './ui/input'
import { SearchIcon } from 'lucide-react'
import { Button } from './ui/button'

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

const SearchBar = () => {
	const router = useRouter()
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
		router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
	}

	return (
		<form onSubmit={handleSubmit} action="/search" className="cursor-pointer">
			<div className="relative text-sm">
				<Input
					name="query"
					value={query}
					className="pe-10 sm:w-64"
					onChange={(event) => setQuery(event.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
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
					className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
					type="submit"
					variant="ghost"
				>
					<SearchIcon className="size-5" />
				</Button>
			</div>
		</form>
	)
}

export default SearchBar
