export const DEFAULT_SITE_URL = "https://marcos-antonio-portfolio.vercel.app";
export const SITE_NAME = "Marcos Antonio";
export const OWNER_JOB_TITLE = "Full-Stack Developer";
export const DEFAULT_DESCRIPTION =
	"Portfolio of Marcos Antonio, a Full-Stack Developer who builds complete solutions, from modern interfaces to robust back-end architectures.";
export const PROJECTS_DESCRIPTION =
	"Projects by Marcos Antonio: full-stack applications, APIs and interfaces, with links to the source code.";

// Cleans the configured site url; invalid or empty values use the default
export function normalizeSiteUrl(raw: string | null | undefined): string {
	const value = raw?.trim().replace(/\/+$/, "");
	if (!value || !/^https?:\/\/\S+$/.test(value)) return DEFAULT_SITE_URL;
	return value;
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteUrl(path: string, siteUrl: string = SITE_URL): string {
	return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
