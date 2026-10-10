import Link from "next/link";

export default function NotFound() {
	return (
		<main className="min-h-screen flex flex-col justify-center items-center">
			<div className="mx-6 flex flex-col items-center text-center gap-4">
				<span className="font-dm-serif-display text-7xl text-[var(--color-primary)]">
					404
				</span>
				<h1 className="text-2xl">Page not found</h1>
				<p className="font-roboto text-[var(--color-gray-400)]">
					The page you are looking for does not exist or has been moved.
				</p>
				<div className="flex flex-wrap justify-center gap-4 mt-2">
					<Link
						href="/"
						className="button font-roboto font-light px-4 py-1.5 cursor-pointer"
					>
						Back to home
					</Link>
					<Link
						href="/projects"
						className="font-roboto font-light self-center px-4 py-1.5 cursor-pointer underline underline-offset-4 text-[var(--color-link)]"
					>
						See projects
					</Link>
				</div>
			</div>
		</main>
	);
}
