import Link from 'next/link'
import UserButton from './users/Button'
import SearchBar from './SearchBar'

const Navbar = () => {
	return (
		<header className="sticky top-0 z-10 bg-card shadow-xl">
			<nav className="container mx-auto flex flex-wrap items-center justify-between gap-5 px-5 py-3">
				<Link href="/" className="text-2xl font-bold text-primary">
					Next Book
				</Link>
				<div className="flex flex-row gap-3 sm:ms-auto">
					<SearchBar />
					<UserButton />
				</div>
			</nav>
		</header>
	)
}

Navbar.displayName = 'Navbar'

export default Navbar
