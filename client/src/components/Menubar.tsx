import Link from 'next/link'
import UserButton from './UserButton'
import SearchBar from './SearchBar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MenubarProps {
	className?: string
}

const Menubar = ({ className }: MenubarProps) => {
	return (
        <div className={cn('', className)}>
            <Button></Button>
        </div>
	)
}

Menubar.displayName = 'Menubar'

export default Menubar
