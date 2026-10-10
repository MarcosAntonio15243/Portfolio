import { describe, expect, it } from "vitest";
import {
	buildBreadcrumbJsonLd,
	buildPersonJsonLd,
	buildProjectJsonLd,
	buildWebSiteJsonLd,
	compact,
	serializeJsonLd,
} from "./json-ld";

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
