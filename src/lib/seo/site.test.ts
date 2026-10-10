import { describe, expect, it } from "vitest";
import { absoluteUrl, DEFAULT_SITE_URL, normalizeSiteUrl } from "./site";

describe("normalizeSiteUrl", () => {
	it.each([
		["https://example.dev", "https://example.dev"],
		["https://example.dev/", "https://example.dev"],
		["  https://example.dev///  ", "https://example.dev"],
		["http://localhost:3000/", "http://localhost:3000"],
	])("keeps a valid url: %j", (input, expected) => {
		expect(normalizeSiteUrl(input)).toBe(expected);
	});

	it.each([
		undefined,
		null,
		"",
		"   ",
		"example.dev",
		"ftp://example.dev",
		"not a url",
	])("falls back to the default for %j", (input) => {
		expect(normalizeSiteUrl(input)).toBe(DEFAULT_SITE_URL);
	});
});

describe("absoluteUrl", () => {
	it("joins the site url and a path without double slashes", () => {
		expect(absoluteUrl("/projects", "https://a.dev")).toBe(
			"https://a.dev/projects",
		);
		expect(absoluteUrl("/", "https://a.dev")).toBe("https://a.dev/");
	});
	it("adds the missing leading slash", () => {
		expect(absoluteUrl("projects/x", "https://a.dev")).toBe(
			"https://a.dev/projects/x",
		);
	});
});
