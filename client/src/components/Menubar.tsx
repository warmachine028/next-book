import Link from 'next/link'
import UserButton from './UserButton'
import SearchBar from './SearchBar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Bell, Home, Mail } from 'lucide-react'

interface MenubarProps {
	className?: string
}

const Menubar = ({ className }: MenubarProps) => {
	return (
		<div className={cn('', className)}>
			<Button className="flex items-center justify-start gap-3" variant="ghost" title="Home" asChild>
				<Link href="/">
					<Home />
					<span className="hidden lg:inline">Home</span>
				</Link>
			</Button>
			<Button className="flex items-center justify-start gap-3" variant="ghost" title="Notifications" asChild>
				<Link href="/notifications">
					<Bell />
					<span className="hidden lg:inline">Notifications</span>
				</Link>
			</Button>
			<Button className="flex items-center justify-start gap-3" variant="ghost" title="Messages" asChild>
				<Link href="/messages">
					<Mail />
					<span className="hidden lg:inline">Messages</span>
				</Link>
			</Button>
			<Button className="flex items-center justify-start gap-3" variant="ghost" title="Bookmarks" asChild>
				<Link href="/bookmarks">
					<Home />
					<span className="hidden lg:inline">Bookmarks</span>
				</Link>
			</Button>
		</div>
	)
}

Menubar.displayName = 'Menubar'

export default Menubar
