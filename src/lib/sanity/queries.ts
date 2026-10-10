import { client } from "./client";
import type { ExperienceDoc, ProjectDoc, SiteSettingsDoc } from "./types";

const PROJECT_FIELDS = `
	_id,
	title,
	"slug": slug.current,
	summary,
	technologies,
	"coverUrl": cover.asset->url,
	featured,
	order,
	repositories[]{ label, repo }
`;

const REVALIDATE_SECONDS = 3600; // safety net; the webhook revalidates on publish

export async function getFeaturedProjects(): Promise<ProjectDoc[]> {
	return client.fetch(
		`*[_type == "project" && featured == true && count(repositories) > 0] | order(order asc, title asc){${PROJECT_FIELDS}}`,
		{},
		{ next: { tags: ["project"], revalidate: REVALIDATE_SECONDS } },
	);
}

export async function getAllProjects(): Promise<ProjectDoc[]> {
	return client.fetch(
		`*[_type == "project" && count(repositories) > 0] | order(order asc, title asc){${PROJECT_FIELDS}}`,
		{},
		{ next: { tags: ["project"], revalidate: REVALIDATE_SECONDS } },
	);
}

export async function getProjectBySlug(
	slug: string,
): Promise<ProjectDoc | null> {
	return client.fetch(
		`*[_type == "project" && slug.current == $slug && count(repositories) > 0][0]{${PROJECT_FIELDS}}`,
		{ slug },
		{ next: { tags: ["project"], revalidate: REVALIDATE_SECONDS } },
	);
}

export async function getExperiences(): Promise<ExperienceDoc[]> {
	return client.fetch(
		`*[_type == "experience"] | order(dateStart desc){_id, jobTitle, enterprise, dateStart, dateEnd, description}`,
		{},
		{ next: { tags: ["experience"], revalidate: REVALIDATE_SECONDS } },
	);
}

export async function getSiteSettings(): Promise<SiteSettingsDoc | null> {
	return client.fetch(
		`*[_type == "siteSettings"][0]{
			"profileImageUrl": profileImage.asset->url,
			headline, subheadline, intro, location, email, githubUrl, linkedinUrl,
			cvLinks[]{ lang, flag, href },
			about, contactText
		}`,
		{},
		{ next: { tags: ["siteSettings"], revalidate: REVALIDATE_SECONDS } },
	);
}
