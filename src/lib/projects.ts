export interface RepoRef {
	label: string;
	repo: string;
}

export const DEFAULT_DESCRIPTION = "Description coming soon";

// Accepts "owner/name" or a GitHub URL and returns "owner/name"
export function normalizeRepo(input: string): string | null {
	const value = input.trim();
	const fromUrl = value.match(/^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+)/);
	const parts = fromUrl ? [fromUrl[1], fromUrl[2]] : value.split("/");
	if (parts.length !== 2) return null;
	const [owner, rawName] = parts;
	const name = rawName.replace(/\.git$/, "");
	if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(name)) return null;
	return `${owner}/${name}`;
}

export function tabId(label: string): string {
	return label
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function selectRepo(repos: RepoRef[], tab: string | undefined): RepoRef {
	return repos.find((r) => tab && tabId(r.label) === tab) ?? repos[0];
}

export function resolveDescription(
	summary: string | null | undefined,
	repoDescriptions: (string | null | undefined)[],
): string {
	const own = summary?.trim();
	if (own) return own;
	for (const d of repoDescriptions) {
		if (d?.trim()) return d.trim();
	}
	return DEFAULT_DESCRIPTION;
}

export function pickMainImage(
	o: {
		coverUrl?: string | null;
		ogImage?: string | null;
		readmeImages?: string[];
	},
	placeholder: string,
): string {
	return o.coverUrl || o.ogImage || o.readmeImages?.[0] || placeholder;
}

export function formatMonthYear(isoDate: string): string {
	return new Date(isoDate).toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});
}
