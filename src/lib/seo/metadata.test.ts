import { describe, expect, it } from "vitest";
import { pageMetadata, truncate } from "./metadata";

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
