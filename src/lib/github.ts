const GITHUB_API = "https://api.github.com";
const BADGE_PATTERNS = [
	/img\.shields\.io/,
	/badge\.fury\.io/,
	/badges\.gitter\.im/,
	/codecov\.io\/gh/,
	/github\.com\/.*\/workflows\/.*\/badge/,
	/travis-ci\.(org|com)/,
	/circleci\.com\/gh/,
	/snyk\.io\/test/,
	/david-dm\.org/,
	/badgen\.net/,
	/flat\.badgen\.net/,
];

const headers: HeadersInit = {
	Accept: "application/vnd.github+json",
	"X-GitHub-Api-Version": "2022-11-28",
	...(process.env.GITHUB_TOKEN
		? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
		: {}),
};

export interface GithubRepo {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	topics: string[];
	language: string | null;
	languages_url: string;
	stargazers_count: number;
	forks_count: number;
	updated_at: string;
	created_at: string;
	open_graph_image_url: string | null;
	default_branch: string;
}

export interface RepoDetail extends GithubRepo {
	readme: string | null;
	languages: Record<string, number>;
	images: string[];
}

function isBadgeUrl(url: string): boolean {
	return BADGE_PATTERNS.some((pattern) => pattern.test(url));
}

// Try to fetch the Open Graph image with retry and exponential backoff
export async function fetchOgImageWithRetry(
	repoFullName: string,
	retries = 4,
	baseDelay = 1000,
): Promise<string | null> {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetch(`https://github.com/${repoFullName}`, {
				headers: { "User-Agent": "portfolio-bot" },
				next: { revalidate: 3600 },
			});

			if (res.status === 429) {
				const retryAfter = res.headers.get("Retry-After");
				const delay = retryAfter
					? parseInt(retryAfter, 10) * 1000
					: baseDelay * 2 ** attempt;
				if (attempt < retries) {
					await new Promise((r) => setTimeout(r, delay));
					continue;
				}
				return null;
			}

			if (!res.ok) return null;

			const html = await res.text();
			const match = html.match(/<meta property="og:image"\s+content="([^"]+)"/);
			return match?.[1] ?? null;
		} catch {
			if (attempt < retries) {
				await new Promise((r) => setTimeout(r, baseDelay * 2 ** attempt));
			}
		}
	}
	return null;
}

// Get detailed info for a single repo, including README and languages
export async function getRepoDetail(
	repoFullName: string,
): Promise<RepoDetail | null> {
	const [owner, name] = repoFullName.split("/");
	const [repoRes, readmeRes, languagesRes] = await Promise.allSettled([
		fetch(`${GITHUB_API}/repos/${owner}/${name}`, {
			headers,
			next: { revalidate: 0 },
		}),
		fetch(`${GITHUB_API}/repos/${owner}/${name}/readme`, {
			headers,
			next: { revalidate: 0 },
		}),
		fetch(`${GITHUB_API}/repos/${owner}/${name}/languages`, {
			headers,
			next: { revalidate: 0 },
		}),
	]);

	if (repoRes.status === "rejected" || !repoRes.value.ok) return null;

	const repo: GithubRepo = await repoRes.value.json();

	// README decoded
	let readme: string | null = null;
	if (readmeRes.status === "fulfilled" && readmeRes.value.ok) {
		const readmeData = await readmeRes.value.json();
		readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
	}

	// Languages
	let languages: Record<string, number> = {};
	if (languagesRes.status === "fulfilled" && languagesRes.value.ok) {
		languages = await languagesRes.value.json();
	}

	// Extract images from README (absolute and relative links converted)
	const images = extractImagesFromReadme(readme, repo);

	const ogImage = await fetchOgImageWithRetry(repo.full_name);

	return { ...repo, readme, languages, images, open_graph_image_url: ogImage };
}

// Extract URLs of images from README
function extractImagesFromReadme(
	readme: string | null,
	repo: GithubRepo,
): string[] {
	if (!readme) return [];

	const rawBase = `https://raw.githubusercontent.com/${repo.full_name.split("/")[0]}/${repo.name}/${repo.default_branch}`;
	const imgRegex = /!\[.*?\]\((.*?)\)/g;
	const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
	const found = new Set<string>();

	for (const regex of [imgRegex, htmlImgRegex]) {
		for (const match of readme.matchAll(regex)) {
			const url = resolveImageUrl(match[1], rawBase);
			if (url && !isBadgeUrl(url)) found.add(url);
		}
	}

	return Array.from(found);
}

// Resolve relative image URLs to absolute GitHub raw URLs
function resolveImageUrl(url: string, rawBase: string): string | null {
	if (!url || url.startsWith("http://") || url.startsWith("https://")) {
		return url || null;
	}
	if (url.startsWith("./") || url.startsWith("../") || !url.startsWith("/")) {
		return `${rawBase}/${url.replace(/^\.\//, "")}`;
	}
	return `${rawBase}${url}`;
}

export interface RepoMeta {
	description: string | null;
	language: string | null;
	updated_at: string;
}

// Light lookup used for card data and the description fallback
export async function getRepoMeta(
	repoFullName: string,
): Promise<RepoMeta | null> {
	try {
		const res = await fetch(`${GITHUB_API}/repos/${repoFullName}`, {
			headers,
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}

// Color by language (for the badges)
export const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	Python: "#3572A5",
	Rust: "#dea584",
	Go: "#00ADD8",
	Java: "#b07219",
	"C#": "#178600",
	"C++": "#f34b7d",
	C: "#555555",
	CSS: "#563d7c",
	HTML: "#e34c26",
	Shell: "#89e051",
	Kotlin: "#A97BFF",
	Swift: "#F05138",
	Ruby: "#701516",
	PHP: "#4F5D95",
	Dart: "#00B4AB",
	Vue: "#41b883",
};
