import { type LlmsData, portableTextToPlain } from "@/lib/llms/format";
import { resolveProjectDescription } from "@/lib/projects/card-data";
import { cleanTechnologies, normalizeRepo } from "@/lib/projects/helpers";
import {
	getAllProjects,
	getExperiences,
	getSiteSettings,
} from "@/lib/sanity/queries";
import {
	DEFAULT_DESCRIPTION,
	OWNER_JOB_TITLE,
	SITE_NAME,
} from "@/lib/seo/site";

export async function loadLlmsData(): Promise<LlmsData> {
	const [settings, experiences, projects] = await Promise.all([
		getSiteSettings(),
		getExperiences(),
		getAllProjects(),
	]);

	const described = await Promise.all(
		projects.map(async (p) => ({
			title: p.title,
			slug: p.slug,
			description: await resolveProjectDescription(p),
			technologies: cleanTechnologies(p.technologies).map((t) => t.name),
			repositories: p.repositories.flatMap((r) => {
				const full = normalizeRepo(r.repo);
				return full
					? [{ label: r.label, url: `https://github.com/${full}` }]
					: [];
			}),
		})),
	);

	return {
		name: SITE_NAME,
		role: OWNER_JOB_TITLE,
		summary:
			settings?.seoDescription?.trim() ||
			settings?.intro?.trim() ||
			DEFAULT_DESCRIPTION,
		about: portableTextToPlain(settings?.about),
		location: settings?.location ?? null,
		github: settings?.githubUrl ?? null,
		linkedin: settings?.linkedinUrl ?? null,
		experiences: experiences.map((e) => ({
			jobTitle: e.jobTitle,
			enterprise: e.enterprise,
			dateStart: e.dateStart,
			dateEnd: e.dateEnd,
			description: e.description,
		})),
		projects: described,
	};
}
