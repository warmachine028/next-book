import Link from 'next/link'
import { Button } from './ui/button'
import { IconBrandGoogle } from '@tabler/icons-react'

const GoogleSignInButton = () => {
	return (
		<Button variant="outline" className="bg-white text-black hover:bg-gray-100 hover:text-black" asChild>
			<Link href="/login/google" className="flex w-full items-center gap-2">
				<IconBrandGoogle />
				Sign in with Google
			</Link>
		</Button>
	)
}

GoogleSignInButton.displayName = 'GoogleSignInButton'

export default GoogleSignInButton
