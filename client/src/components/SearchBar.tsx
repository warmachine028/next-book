'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { Input } from './ui/input'
import { SearchIcon } from 'lucide-react'

const sugessions = [
	'🐶 dogs',
	'🐈cats',
	'🍗 food',
	'👩‍💻 coding',
	'✈️ travelling Vlogs',
	'cute puppies',
	'💒 weddings',
	'🧑 people'
]

const SearchBar = () => {
	const router = useRouter()
	const [placeholder, setPlaceholder] = useState(`${sugessions[2]}`)
	const [query, setQuery] = useState('')

	useEffect(() => {
		const interval = setInterval(() => {
			const suggession = sugessions[Math.floor(Math.random() * sugessions.length)]
			setPlaceholder(suggession)
		}, 3000)
		return () => clearInterval(interval)
	}, [])

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
			<div className="relative">
				<Input
					name="query"
					placeholder={`Search for ${placeholder}`}
					value={query}
					className="pe-10 sm:w-64"
					onChange={(event) => setQuery(event.target.value)}
				/>

				<button
					className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 transform"
					type="submit"
				>
					<SearchIcon className="size-5" />
				</button>
			</div>
		</form>
	)
}

SearchBar.displayName = 'SearchBar'

export default SearchBar
