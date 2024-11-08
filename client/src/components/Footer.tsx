import Link from 'next/link'
import {
	IconBrandGithub as Github,
	IconBrandTwitter as Twitter,
	IconBrandInstagram as Instagram,
	IconBrandLinkedin as Linkedin,
	IconBrandLinktree as Linktree
} from '@tabler/icons-react'

const Footer = () => {
	return (
		<footer className="mt-auto border-t py-4 backdrop-blur-md">
			<div className="container mx-auto flex items-center justify-between px-4 text-gray-600">
				<div className="text-sm">
					Built by{' '}
					<Link
						href="https://warmachine028.vercel.app"
						className="underline transition-colors"
						target="_blank"
					>
						<code>Warmachine028</code>
					</Link>
				</div>
				<div className="flex space-x-4 transition-colors">
					<Link
						href="https://github.com/warmachine028"
						aria-label="GitHub profile"
						className="hover:text-primary"
						target="_blank"
					>
						<Github />
					</Link>
					<Link
						href="https://twitter.com/pritamkundu771"
						aria-label="Twitter profile"
						className="hover:text-primary"
						target="_blank"
					>
						<Twitter />
					</Link>
					<Link
						href="https://instagram.com/srija.ad_"
						aria-label="Instagram profile"
						className="hover:text-primary"
						target="_blank"
					>
						<Instagram />
					</Link>
					<Link
						href="https://www.linkedin.com/in/pritam-kunduu/"
						aria-label="LinkedIn profile"
						className="hover:text-primary"
						target="_blank"
					>
						<Linkedin />
					</Link>
					<Link
						href="https://linktr.ee/pritamkd"
						aria-label="Linktree profile"
						className="hover:text-primary"
						target="_blank"
					>
						<Linktree />
					</Link>
				</div>
			</div>
		</footer>
	)
}

Footer.displayName = 'Footer'

export default Footer
