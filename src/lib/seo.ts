import type { Metadata, MetadataRoute } from "next";
import { absoluteUrl, OWNER_JOB_TITLE, SITE_NAME } from "./site";

function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined || value === "") return true;
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === "object") return Object.keys(value).length === 0;
	return false;
}

// Recursively removes null, undefined, empty strings, empty arrays and objects
export function compact(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(compact).filter((item) => !isEmpty(item));
	}
	if (value && typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [key, item] of Object.entries(value)) {
			const cleaned = compact(item);
			if (!isEmpty(cleaned)) out[key] = cleaned;
		}
		return out;
	}
	return value;
}

// Safe to place inside a script tag: "<" can never close it
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(compact(data)).replace(/</g, "\\u003c");
}

export interface PersonInput {
	url: string;
	image?: string | null;
	github?: string | null;
	linkedin?: string | null;
	location?: string | null;
	skills?: string[];
}

export function buildPersonJsonLd(i: PersonInput): Record<string, unknown> {
	return compact({
		"@context": "https://schema.org",
		"@type": "Person",
		name: SITE_NAME,
		jobTitle: OWNER_JOB_TITLE,
		url: i.url,
		image: i.image,
		sameAs: [i.github, i.linkedin],
		knowsAbout: i.skills,
		address: i.location
			? { "@type": "PostalAddress", addressLocality: i.location }
			: null,
	}) as Record<string, unknown>;
}

export function buildWebSiteJsonLd(url: string): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: SITE_NAME,
		url,
	};
}

export interface ProjectLdInput {
	name: string;
	description: string;
	url: string;
	repositories: string[];
	languages: string[];
	authorUrl: string;
}

export function buildProjectJsonLd(i: ProjectLdInput): Record<string, unknown> {
	return compact({
		"@context": "https://schema.org",
		"@type": "SoftwareSourceCode",
		name: i.name,
		description: i.description,
		url: i.url,
		codeRepository:
			i.repositories.length === 1 ? i.repositories[0] : i.repositories,
		programmingLanguage: i.languages,
		author: { "@type": "Person", name: SITE_NAME, url: i.authorUrl },
	}) as Record<string, unknown>;
}

export function buildBreadcrumbJsonLd(
	items: { name: string; url: string }[],
): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

export function truncate(text: string, max: number): string {
	if (text.length <= max) return text;
	return `${text.slice(0, max - 3).trimEnd()}...`;
}

// Open Graph and Twitter data are replaced (not merged) by page metadata,
// so every page repeats the shared fields through this helper
export function pageMetadata(o: {
	title?: string;
	description: string;
	path: string;
}): Metadata {
	const fullTitle = o.title
		? `${o.title} | ${SITE_NAME}`
		: `${SITE_NAME} | ${OWNER_JOB_TITLE}`;
	return {
		...(o.title ? { title: o.title } : {}),
		description: o.description,
		alternates: { canonical: o.path },
		openGraph: {
			type: "website",
			siteName: SITE_NAME,
			locale: "en_US",
			url: o.path,
			title: fullTitle,
			description: o.description,
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description: o.description,
		},
	};
}

export const AI_CRAWLERS = [
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"ClaudeBot",
	"Claude-User",
	"Claude-SearchBot",
	"PerplexityBot",
	"Google-Extended",
	"Applebot-Extended",
];

export function buildRobots(siteUrl: string): MetadataRoute.Robots {
	const rule = { allow: "/", disallow: ["/studio", "/api/"] };
	return {
		rules: [
			{ userAgent: "*", ...rule },
			...AI_CRAWLERS.map((userAgent) => ({ userAgent, ...rule })),
		],
		sitemap: absoluteUrl("/sitemap.xml", siteUrl),
		host: siteUrl,
	};
}

export function buildSitemap(
	projects: { slug: string; updatedAt?: string | null }[],
	siteUrl: string,
): MetadataRoute.Sitemap {
	const latest = projects
		.map((p) => p.updatedAt)
		.filter((d): d is string => Boolean(d))
		.sort()
		.at(-1);
	const listDate = latest ? new Date(latest) : undefined;

	return [
		{
			url: absoluteUrl("/", siteUrl),
			lastModified: listDate,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: absoluteUrl("/projects", siteUrl),
			lastModified: listDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		...projects.map((p) => ({
			url: absoluteUrl(`/projects/${p.slug}`, siteUrl),
			lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];
}
