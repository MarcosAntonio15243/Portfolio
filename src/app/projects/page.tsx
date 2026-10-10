import { ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Header } from "@/components/layout";
import { ProjectListCard } from "@/components/projects/ProjectListCard";
import { resolveProjectCard } from "@/lib/projects/card-data";
import { getAllProjects } from "@/lib/sanity/queries";
import { pageMetadata } from "@/lib/seo/metadata";
import { PROJECTS_DESCRIPTION } from "@/lib/seo/site";

export const revalidate = 60;

export const metadata = pageMetadata({
	title: "Projects",
	description: PROJECTS_DESCRIPTION,
	path: "/projects",
});

export default async function ProjectsPage() {
	const projects = await Promise.all(
		(await getAllProjects()).map(resolveProjectCard),
	);

	return (
		<div>
			<Header />
			<main className="pt-12 flex flex-col justify-center items-center">
				<div className="mx-6 max-content-w flex flex-col gap-10 py-10">
					<section className="flex flex-row justify-between gap-3">
						<h1 className="name page-title">All Projects</h1>
						<a
							href="https://github.com/MarcosAntonio15243?tab=repositories"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="See all repositories on GitHub"
							className="flex items-center gap-1.5 text-sm font-roboto underline underline-offset-4 text-[var(--color-link)] w-fit"
						>
							<span className="sm:hidden">GitHub</span>
							<span className="max-sm:hidden">See all on GitHub</span>
							<FiGithub className="size-4" />
							<ArrowUpRight className="size-4" />
						</a>
					</section>

					{projects.length === 0 ? (
						<div className="text-center text-[var(--color-gray-400)] font-roboto">
							<p>No projects yet.</p>
							<p className="text-sm mt-2">
								Add projects in /studio for them to appear here.
							</p>
						</div>
					) : (
						<section>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
								{projects.map((p) => (
									<ProjectListCard key={p.slug} project={p} />
								))}
							</div>
						</section>
					)}
				</div>
			</main>
		</div>
	);
}
