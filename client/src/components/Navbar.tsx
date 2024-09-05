import Link from 'next/link'
import UserButton from './UserButton'
import SearchBar from './SearchBar'

const Navbar = () => {
	return (
		<header className="bg-card ring-primary sticky top-0 z-10 shadow-xl ring-1">
			<div className="container mx-auto flex flex-wrap items-center justify-center gap-5 px-5 py-3">
				<Link href="/" className="text-primary text-2xl font-bold">
					Next Book
				</Link>
				<SearchBar />
				<UserButton className="sm:ms-auto" />
			</div>
		</header>
	)
}

Navbar.displayName = 'Navbar'

export default Navbar
