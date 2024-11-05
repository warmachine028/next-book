'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { LinkIt, LinkItUrl } from 'react-linkify-it'
import { LinkWithTooltip } from './users'

interface LinkifyProps {
	children: ReactNode
}

const Linkify = ({ children }: LinkifyProps) => {
	return (
		<LinkifyUsername>
			<LinkifyHashtag>
				<LinkifyURL>{children}</LinkifyURL>
			</LinkifyHashtag>
		</LinkifyUsername>
	)
}

const LinkifyURL = ({ children }: LinkifyProps) => {
	return <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
}

const LinkifyUsername = ({ children }: LinkifyProps) => {
	return (
		<LinkIt
			regex={/(@[a-zA-Z0-9_-]+)/}
			component={(match, key) => (
				<LinkWithTooltip username={match.slice(1)} key={key}>
					{match}
				</LinkWithTooltip>
			)}
		>
			{children}
		</LinkIt>
	)
}

const LinkifyHashtag = ({ children }: LinkifyProps) => {
	return (
		<LinkIt
			regex={/(#[a-zA-Z0-9]+)/}
			component={(match, key) => (
				<Link key={key} href={`/hashtag/${match.slice(1)}`} className="text-primary hover:underline">
					{match}
				</Link>
			)}
		>
			{children}
		</LinkIt>
	)
}

Linkify.displayName = 'Linkify'
export default Linkify
