import { describe, expect, it } from "vitest";
import {
	buildLlmsFullTxt,
	buildLlmsTxt,
	type LlmsData,
	portableTextToPlain,
} from "./llms";

const SITE = "https://example.dev";

const data: LlmsData = {
	name: "Marcos Antonio",
	role: "Full-Stack Developer",
	summary: "Builds complete solutions.",
	about: "First paragraph.\n\nSecond paragraph.",
	location: "Campina Grande, Brazil",
	github: "https://github.com/me",
	linkedin: "https://linkedin.com/in/me",
	experiences: [
		{
			jobTitle: "Full-Stack Developer",
			enterprise: "Creatorsfy",
			dateStart: "2025-08-01",
			dateEnd: null,
			description: "Works with NestJS.",
		},
		{
			jobTitle: "Front-End Developer",
			enterprise: "CODEX",
			dateStart: "2022-11-01",
			dateEnd: "2023-07-01",
			description: "Built React apps.",
		},
	],
	projects: [
		{
			title: "Let Me Ask",
			slug: "let-me-ask",
			description: "A live Q&A app\nwith AI answers.",
			technologies: ["React", "NestJs"],
			repositories: [
				{ label: "Front-end", url: "https://github.com/me/web" },
				{ label: "Back-end", url: "https://github.com/me/api" },
			],
		},
	],
};

describe("portableTextToPlain", () => {
	it("joins block texts into paragraphs and ignores non-text children", () => {
		const blocks = [
			{ children: [{ text: "Hello " }, { text: "world" }, { _type: "x" }] },
			{ children: [{ text: "  " }] },
			{ children: [{ text: "Second" }] },
			"not a block",
			null,
		];
		expect(portableTextToPlain(blocks)).toBe("Hello world\n\nSecond");
	});
	it("returns an empty string for missing input", () => {
		expect(portableTextToPlain(null)).toBe("");
		expect(portableTextToPlain(undefined)).toBe("");
		expect(portableTextToPlain([])).toBe("");
	});
});

describe("buildLlmsTxt", () => {
	const out = buildLlmsTxt(data, SITE);
	it("starts with the name and the summary quote", () => {
		expect(
			out.startsWith("# Marcos Antonio\n\n> Builds complete solutions."),
		).toBe(true);
	});
	it("links the main pages and every project with a one line description", () => {
		expect(out).toContain("- [Home](https://example.dev/)");
		expect(out).toContain("- [Projects](https://example.dev/projects)");
		expect(out).toContain(
			"- [Let Me Ask](https://example.dev/projects/let-me-ask): A live Q&A app with AI answers.",
		);
	});
	it("links the full content file and the social profiles", () => {
		expect(out).toContain("(https://example.dev/llms-full.txt)");
		expect(out).toContain("- [GitHub](https://github.com/me)");
		expect(out).toContain("- [LinkedIn](https://linkedin.com/in/me)");
	});
	it("works with no projects and no social links", () => {
		const empty = buildLlmsTxt(
			{ ...data, projects: [], github: null, linkedin: null },
			SITE,
		);
		expect(empty).not.toContain("## Projects");
		expect(empty).not.toContain("GitHub");
		expect(empty).not.toContain("null");
		expect(empty.endsWith("\n")).toBe(true);
	});
});

describe("buildLlmsFullTxt", () => {
	const out = buildLlmsFullTxt(data, SITE);
	it("includes the about text and the location", () => {
		expect(out).toContain("## About");
		expect(out).toContain("First paragraph.\n\nSecond paragraph.");
		expect(out).toContain("Campina Grande, Brazil");
	});
	it("shows Present for a job without end date and formats the dates", () => {
		expect(out).toContain("### Full-Stack Developer, Creatorsfy");
		expect(out).toContain("Aug 2025 to Present");
		expect(out).toContain("Nov 2022 to Jul 2023");
	});
	it("lists projects with technologies, repositories and page url", () => {
		expect(out).toContain("### Let Me Ask");
		expect(out).toContain("https://example.dev/projects/let-me-ask");
		expect(out).toContain("Technologies: React, NestJs");
		expect(out).toContain("- Front-end: https://github.com/me/web");
		expect(out).toContain("- Back-end: https://github.com/me/api");
	});
	it("omits empty sections and never prints null", () => {
		const minimal = buildLlmsFullTxt(
			{
				...data,
				about: "",
				location: null,
				experiences: [],
				projects: [
					{
						title: "Tiny",
						slug: "tiny",
						description: "Small.",
						technologies: [],
						repositories: [],
					},
				],
			},
			SITE,
		);
		expect(minimal).not.toContain("## About");
		expect(minimal).not.toContain("## Experience");
		expect(minimal).not.toContain("Technologies:");
		expect(minimal).not.toContain("Repositories:");
		expect(minimal).not.toContain("null");
		expect(minimal).toContain("### Tiny");
	});
});
