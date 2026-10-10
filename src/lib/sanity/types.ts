import type { PortableTextBlock } from "next-sanity";
import type { RepoRef } from "@/lib/projects/helpers";

export interface TechnologyDoc {
	name: string;
	color: string | null;
}

export interface ProjectDoc {
	_id: string;
	title: string;
	slug: string;
	summary: string | null;
	technologies: (TechnologyDoc | null)[] | null;
	coverUrl: string | null;
	featured: boolean | null;
	updatedAt: string;
	repositories: RepoRef[];
}

export interface ExperienceDoc {
	_id: string;
	jobTitle: string;
	enterprise: string;
	dateStart: string;
	dateEnd: string | null;
	description: string;
}

export interface SiteSettingsDoc {
	profileImageUrl: string | null;
	headline: string | null;
	subheadline: string | null;
	intro: string | null;
	seoDescription: string | null;
	location: string | null;
	email: string | null;
	githubUrl: string | null;
	linkedinUrl: string | null;
	cvLinks: { lang: string; flag: string; href: string }[] | null;
	about: PortableTextBlock[] | null;
	contactText: string | null;
}
