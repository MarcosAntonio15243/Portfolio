import { Header } from "@/components/layout";
import { ProjectListCard } from "@/components/projects/ProjectListCard";
import { getPortfolioRepos } from "@/lib/github";
import { ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";

export const revalidate = 60;

export default async function ProjectsPage() {
	const repos = await getPortfolioRepos();

	return (
		<div>
			<Header />
			<main className="pt-12 flex flex-col justify-center items-center">
				<div className="mx-6 max-content-w flex flex-col gap-10 py-10">
					{/* Hero da página */}
					<section className="flex flex-row justify-between gap-3">
						<h1 className="name">All Projects</h1>
						<a
							href="https://github.com/MarcosAntonio15243?tab=repositories"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 text-sm font-roboto underline underline-offset-4 text-[var(--color-link)] w-fit"
						>
							See all on GitHub
							<FiGithub className="size-4" />
							<ArrowUpRight className="size-4" />
						</a>
					</section>

					{repos.length === 0 ? (
						<div className="text-center text-[var(--color-gray-400)] font-roboto">
							<p>No repositories with the &quot;portfolio&quot; topic found.</p>
							<p className="text-sm mt-2">
								Add the topic on GitHub for it to appear here.
							</p>
						</div>
					) : (
						<section>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
								{repos.map((repo) => (
									<ProjectListCard key={repo.id} repo={repo} />
								))}
							</div>
						</section>
					)}
				</div>
			</main>
		</div>
	);
}
