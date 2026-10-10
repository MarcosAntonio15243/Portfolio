import { fetchOgImageWithRetry, getRepoDescription } from "@/lib/github";
import {
	normalizeRepo,
	pickMainImage,
	resolveDescription,
} from "@/lib/projects";
import type { ProjectDoc } from "@/lib/sanity/types";

export const PLACEHOLDER_SVG = "/assets/project-placeholder.svg";

export interface ProjectCardData {
	slug: string;
	title: string;
	description: string;
	imageUrl: string;
	technologies: string[];
	repos: { label: string; url: string }[];
}

export async function resolveProjectCard(
	project: ProjectDoc,
): Promise<ProjectCardData> {
	const repos = project.repositories
		.map((r) => ({ label: r.label, full: normalizeRepo(r.repo) }))
		.filter((r): r is { label: string; full: string } => r.full !== null);
	const main = repos[0]?.full;

	// Only hit GitHub for what the CMS did not provide
	const descriptions = project.summary?.trim()
		? []
		: await Promise.all(repos.map((r) => getRepoDescription(r.full)));
	const ogImage =
		project.coverUrl || !main ? null : await fetchOgImageWithRetry(main);

	return {
		slug: project.slug,
		title: project.title,
		description: resolveDescription(project.summary, descriptions),
		imageUrl: pickMainImage(
			{ coverUrl: project.coverUrl, ogImage },
			PLACEHOLDER_SVG,
		),
		technologies: project.technologies ?? [],
		repos: repos.map((r) => ({
			label: r.label,
			url: `https://github.com/${r.full}`,
		})),
	};
}
