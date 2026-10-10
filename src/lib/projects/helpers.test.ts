import { describe, expect, it } from "vitest";
import {
	cleanTechnologies,
	DEFAULT_DESCRIPTION,
	formatMonthYear,
	normalizeRepo,
	pickMainImage,
	resolveDescription,
	selectRepo,
	tabId,
} from "./helpers";

describe("normalizeRepo", () => {
	it.each([
		["owner/name", "owner/name"],
		["https://github.com/owner/name", "owner/name"],
		["https://github.com/owner/name/", "owner/name"],
		["https://github.com/owner/name.git", "owner/name"],
		["https://github.com/owner/name/tree/main/src", "owner/name"],
		["  owner/name  ", "owner/name"],
	])("normalizes %s", (input, expected) => {
		expect(normalizeRepo(input)).toBe(expected);
	});

	it.each(["", "owner", "https://gitlab.com/o/n", "a/b/c d"])(
		"returns null for %j",
		(input) => {
			expect(normalizeRepo(input)).toBeNull();
		},
	);
});

describe("tabId", () => {
	it("slugifies labels", () => {
		expect(tabId("Front-end")).toBe("front-end");
		expect(tabId("Back End API")).toBe("back-end-api");
	});
});

describe("selectRepo", () => {
	const repos = [
		{ label: "Front-end", repo: "o/web" },
		{ label: "Back-end", repo: "o/api" },
	];
	it("selects by tab id", () => {
		expect(selectRepo(repos, "back-end").repo).toBe("o/api");
	});
	it("falls back to the first for unknown or missing tab", () => {
		expect(selectRepo(repos, "mobile").repo).toBe("o/web");
		expect(selectRepo(repos, undefined).repo).toBe("o/web");
		expect(selectRepo(repos, "").repo).toBe("o/web");
	});
});

describe("resolveDescription", () => {
	it("prefers the CMS summary", () => {
		expect(resolveDescription("From CMS", ["gh front"])).toBe("From CMS");
	});
	it("uses the first non-empty repository description in order", () => {
		expect(resolveDescription("  ", [null, "gh back"])).toBe("gh back");
		expect(resolveDescription(undefined, ["gh front", "gh back"])).toBe(
			"gh front",
		);
	});
	it("uses the default text when nothing exists", () => {
		expect(resolveDescription(null, [null, ""])).toBe(DEFAULT_DESCRIPTION);
		expect(resolveDescription(undefined, [])).toBe(DEFAULT_DESCRIPTION);
	});
});

describe("pickMainImage", () => {
	const ph = "/placeholder.svg";
	it("follows cover, og, readme, placeholder", () => {
		expect(
			pickMainImage({ coverUrl: "c", ogImage: "o", readmeImages: ["r"] }, ph),
		).toBe("c");
		expect(pickMainImage({ ogImage: "o", readmeImages: ["r"] }, ph)).toBe("o");
		expect(pickMainImage({ readmeImages: ["r"] }, ph)).toBe("r");
		expect(pickMainImage({}, ph)).toBe(ph);
	});
});

describe("formatMonthYear", () => {
	it("formats as Mon YYYY in UTC", () => {
		expect(formatMonthYear("2025-08-01")).toBe("Aug 2025");
		expect(formatMonthYear("2021-10-31")).toBe("Oct 2021");
		expect(formatMonthYear("2023-01-01")).toBe("Jan 2023");
	});
});

describe("cleanTechnologies", () => {
	it("drops null and nameless entries and keeps order", () => {
		const result = cleanTechnologies([
			{ name: "NextJs", color: "#000000" },
			null,
			{ name: "", color: "#ffffff" },
			{ name: "Zod", color: null },
		]);
		expect(result).toEqual([
			{ name: "NextJs", color: "#000000" },
			{ name: "Zod", color: null },
		]);
	});
	it("returns an empty list for missing input", () => {
		expect(cleanTechnologies(null)).toEqual([]);
		expect(cleanTechnologies(undefined)).toEqual([]);
	});
});
