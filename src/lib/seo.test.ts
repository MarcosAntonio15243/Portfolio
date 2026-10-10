import { describe, expect, it } from "vitest";
import {
	AI_CRAWLERS,
	buildBreadcrumbJsonLd,
	buildPersonJsonLd,
	buildProjectJsonLd,
	buildRobots,
	buildSitemap,
	buildWebSiteJsonLd,
	compact,
	pageMetadata,
	serializeJsonLd,
	truncate,
} from "./seo";

const SITE = "https://example.dev";

describe("compact", () => {
	it("drops null, undefined, empty strings, empty arrays and empty objects", () => {
		expect(
			compact({
				a: null,
				b: undefined,
				c: "",
				d: [],
				e: {},
				f: { g: null },
				h: ["x", null, ""],
			}),
		).toEqual({ h: ["x"] });
	});
	it("keeps zero and false", () => {
		expect(compact({ n: 0, ok: false })).toEqual({ n: 0, ok: false });
	});
});

describe("serializeJsonLd", () => {
	it("escapes less-than so a value cannot close the script tag", () => {
		const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
		expect(out).not.toContain("</script>");
		expect(out).not.toContain("<");
		expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
	});
	it("omits empty fields", () => {
		expect(JSON.parse(serializeJsonLd({ a: "x", b: null, c: [] }))).toEqual({
			a: "x",
		});
	});
});

describe("buildPersonJsonLd", () => {
	it("builds a full person without e-mail", () => {
		const p = buildPersonJsonLd({
			url: SITE,
			image: "https://cdn.dev/me.png",
			github: "https://github.com/me",
			linkedin: "https://linkedin.com/in/me",
			location: "Campina Grande, Brazil",
			skills: ["TypeScript", "NestJs"],
		});
		expect(p["@type"]).toBe("Person");
		expect(p.name).toBe("Marcos Antonio");
		expect(p.jobTitle).toBe("Full-Stack Developer");
		expect(p.sameAs).toEqual([
			"https://github.com/me",
			"https://linkedin.com/in/me",
		]);
		expect(p.knowsAbout).toEqual(["TypeScript", "NestJs"]);
		expect(p.address).toEqual({
			"@type": "PostalAddress",
			addressLocality: "Campina Grande, Brazil",
		});
		expect(JSON.stringify(p)).not.toContain("mailto");
		expect(p).not.toHaveProperty("email");
	});
	it("omits every missing optional field", () => {
		const p = buildPersonJsonLd({ url: SITE });
		for (const key of ["image", "sameAs", "knowsAbout", "address"]) {
			expect(p).not.toHaveProperty(key);
		}
	});
	it("keeps one social link when the other is missing", () => {
		const p = buildPersonJsonLd({
			url: SITE,
			github: "https://github.com/me",
			linkedin: null,
		});
		expect(p.sameAs).toEqual(["https://github.com/me"]);
	});
});

describe("buildWebSiteJsonLd", () => {
	it("describes the site", () => {
		expect(buildWebSiteJsonLd(SITE)).toMatchObject({
			"@type": "WebSite",
			name: "Marcos Antonio",
			url: SITE,
		});
	});
});

describe("buildProjectJsonLd", () => {
	const base = {
		name: "Let Me Ask",
		description: "A dApp",
		url: `${SITE}/projects/let-me-ask`,
		authorUrl: SITE,
	};
	it("uses a string for one repository and a list for several", () => {
		const one = buildProjectJsonLd({
			...base,
			repositories: ["https://github.com/me/a"],
			languages: ["TypeScript"],
		});
		expect(one.codeRepository).toBe("https://github.com/me/a");
		const many = buildProjectJsonLd({
			...base,
			repositories: ["https://github.com/me/a", "https://github.com/me/b"],
			languages: ["TypeScript", "Python"],
		});
		expect(many.codeRepository).toHaveLength(2);
		expect(many.programmingLanguage).toEqual(["TypeScript", "Python"]);
	});
	it("omits repositories and languages when there are none", () => {
		const p = buildProjectJsonLd({
			...base,
			repositories: [],
			languages: [],
		});
		expect(p).not.toHaveProperty("codeRepository");
		expect(p).not.toHaveProperty("programmingLanguage");
		expect(p.author).toEqual({
			"@type": "Person",
			name: "Marcos Antonio",
			url: SITE,
		});
	});
});

describe("buildBreadcrumbJsonLd", () => {
	it("numbers the items from one", () => {
		const b = buildBreadcrumbJsonLd([
			{ name: "Home", url: `${SITE}/` },
			{ name: "Projects", url: `${SITE}/projects` },
		]);
		expect(b.itemListElement).toEqual([
			{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: "Projects",
				item: `${SITE}/projects`,
			},
		]);
	});
});

describe("truncate", () => {
	it("keeps short text", () => {
		expect(truncate("short", 10)).toBe("short");
	});
	it("cuts long text to the limit with three dots", () => {
		const out = truncate("a".repeat(100), 20);
		expect(out).toHaveLength(20);
		expect(out.endsWith("...")).toBe(true);
	});
});

describe("pageMetadata", () => {
	it("builds title, canonical, open graph and twitter data", () => {
		const m = pageMetadata({
			title: "Projects",
			description: "All projects",
			path: "/projects",
		});
		expect(m.title).toBe("Projects");
		expect(m.alternates?.canonical).toBe("/projects");
		expect(m.openGraph).toMatchObject({
			type: "website",
			siteName: "Marcos Antonio",
			title: "Projects | Marcos Antonio",
			url: "/projects",
		});
		expect(m.twitter).toMatchObject({ card: "summary_large_image" });
	});
	it("leaves the layout default title when no title is given", () => {
		const m = pageMetadata({ description: "Home", path: "/" });
		expect(m).not.toHaveProperty("title");
		expect(m.openGraph).toMatchObject({
			title: "Marcos Antonio | Full-Stack Developer",
		});
	});
});

describe("buildRobots", () => {
	const robots = buildRobots(SITE);
	const rules = robots.rules as {
		userAgent?: string;
		allow?: string;
		disallow?: string[];
	}[];
	it("blocks only the studio and api for everyone", () => {
		const all = rules.find((r) => r.userAgent === "*");
		expect(all?.allow).toBe("/");
		expect(all?.disallow).toEqual(["/studio", "/api/"]);
	});
	it("allows each AI crawler explicitly with the same blocks", () => {
		for (const agent of AI_CRAWLERS) {
			const rule = rules.find((r) => r.userAgent === agent);
			expect(rule?.allow).toBe("/");
			expect(rule?.disallow).toEqual(["/studio", "/api/"]);
		}
		expect(AI_CRAWLERS).toEqual(
			expect.arrayContaining(["GPTBot", "ClaudeBot", "PerplexityBot"]),
		);
	});
	it("points to the sitemap and host", () => {
		expect(robots.sitemap).toBe(`${SITE}/sitemap.xml`);
		expect(robots.host).toBe(SITE);
	});
});

describe("buildSitemap", () => {
	it("lists home and projects page even with no projects", () => {
		const s = buildSitemap([], SITE);
		expect(s.map((e) => e.url)).toEqual([`${SITE}/`, `${SITE}/projects`]);
		expect(s[0].lastModified).toBeUndefined();
	});
	it("adds each project and uses the latest update date for the lists", () => {
		const s = buildSitemap(
			[
				{ slug: "a", updatedAt: "2026-01-01T00:00:00Z" },
				{ slug: "b", updatedAt: "2026-03-01T00:00:00Z" },
				{ slug: "c", updatedAt: null },
			],
			SITE,
		);
		expect(s.map((e) => e.url)).toEqual([
			`${SITE}/`,
			`${SITE}/projects`,
			`${SITE}/projects/a`,
			`${SITE}/projects/b`,
			`${SITE}/projects/c`,
		]);
		expect(s[0].lastModified).toEqual(new Date("2026-03-01T00:00:00Z"));
		expect(s[3].lastModified).toEqual(new Date("2026-03-01T00:00:00Z"));
		expect(s[4].lastModified).toBeUndefined();
	});
});
