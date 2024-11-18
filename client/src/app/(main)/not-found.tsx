import { Menubar } from '@/components'

const NotFound = () => {
	return (
		<main className="container mx-auto flex min-h-[calc(100vh-125px)] w-full grow gap-5 p-5">
			<Menubar className="top-[5.25rem] hidden h-fit flex-none space-y-3 bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
			<div className="flex w-full min-w-0 flex-col gap-5 text-center">
				<h1 className="text-3xl font-bold">Not Found</h1>
				<p>The page you are looking for does not exist.</p>
			</div>
		</main>
	)
}
export default NotFound
