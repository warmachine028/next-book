import { ThemeSwitch } from '@/components'
// import Image from 'next/image'
// import Link from 'next/link'

const Home = () => {
	return (
		<div className="flex">
			<div className="flex w-full items-center justify-center gap-5">
				<ThemeSwitch />
				Front Junk
			</div>
		</div>
	)
}

export default Home
