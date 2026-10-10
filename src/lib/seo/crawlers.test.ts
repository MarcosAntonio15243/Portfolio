import { describe, expect, it } from "vitest";
import { AI_CRAWLERS, buildRobots, buildSitemap } from "./crawlers";

const SITE = "https://example.dev";

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
