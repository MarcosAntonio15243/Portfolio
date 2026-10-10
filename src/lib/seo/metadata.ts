import type { Metadata } from "next";
import { OWNER_JOB_TITLE, SITE_NAME } from "./site";

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
