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

	useEffect(() => {
		const interval = setInterval(() => {
			const suggession = sugessions[Math.floor(Math.random() * sugessions.length)]
			setPlaceholder(suggession)
		}, 3000)
		return () => clearInterval(interval)
	}, [])

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const form = event.currentTarget
		const query = (form.query as HTMLInputElement).value.trim()
		if (!query) {
			return
		}
		router.push(`/search?q=${encodeURIComponent(query)}`)
	}

	return (
		<form onSubmit={handleSubmit} action="/search">
			<div className="relative">
				<Input name="query" placeholder={`Search for ${placeholder}`} className="pe-10 sm:w-64" />

				<SearchIcon className="text-muted-foreground absolute right-3 top-1/2 size-5 -translate-y-1/2 transform" />
			</div>
		</form>
	)
}

SearchBar.displayName = 'SearchBar'

export default SearchBar
