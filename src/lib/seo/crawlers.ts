import type { MetadataRoute } from "next";
import { absoluteUrl } from "./site";

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
