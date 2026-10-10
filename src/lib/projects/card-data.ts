import { fetchOgImageWithRetry, getRepoMeta } from "@/lib/github";
import {
	cleanTechnologies,
	normalizeRepo,
	pickMainImage,
	resolveDescription,
	type Technology,
} from "@/lib/projects/helpers";
import type { ProjectDoc } from "@/lib/sanity/types";

export const PLACEHOLDER_SVG = "/assets/project-placeholder.svg";

export interface ProjectCardData {
	slug: string;
	title: string;
	description: string;
	imageUrl: string;
	technologies: Technology[];
	mainLanguage: string | null;
	updatedAt: string | null;
}

export async function resolveProjectCard(
	project: ProjectDoc,
): Promise<ProjectCardData> {
	const repos = project.repositories
		.map((r) => ({ label: r.label, full: normalizeRepo(r.repo) }))
		.filter((r): r is { label: string; full: string } => r.full !== null);
	const main = repos[0]?.full;

	// Repository metadata is cached for an hour and feeds the description
	// fallback, the main language and the last update date
	const metas = await Promise.all(repos.map((r) => getRepoMeta(r.full)));
	const ogImage =
		project.coverUrl || !main ? null : await fetchOgImageWithRetry(main);
	const updatedAt =
		metas
			.map((m) => m?.updated_at)
			.filter((d): d is string => Boolean(d))
			.sort()
			.at(-1) ?? null;

	return {
		slug: project.slug,
		title: project.title,
		description: resolveDescription(
			project.summary,
			metas.map((m) => m?.description),
		),
		imageUrl: pickMainImage(
			{ coverUrl: project.coverUrl, ogImage },
			PLACEHOLDER_SVG,
		),
		technologies: cleanTechnologies(project.technologies),
		mainLanguage: metas[0]?.language ?? null,
		updatedAt,
	};
}

// Description only: avoids the image lookup that resolveProjectCard does
export async function resolveProjectDescription(
	project: ProjectDoc,
): Promise<string> {
	if (project.summary?.trim()) {
		return resolveDescription(project.summary, []);
	}
	const repos = project.repositories
		.map((r) => normalizeRepo(r.repo))
		.filter((r): r is string => r !== null);
	const metas = await Promise.all(repos.map((r) => getRepoMeta(r)));
	return resolveDescription(
		project.summary,
		metas.map((m) => m?.description),
	);
}
