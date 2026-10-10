import { formatMonthYear } from "./projects";
import { absoluteUrl } from "./site";

export interface LlmsExperience {
	jobTitle: string;
	enterprise: string;
	dateStart: string; // ISO date
	dateEnd: string | null; // null means current job
	description: string;
}

export interface LlmsProject {
	title: string;
	slug: string;
	description: string;
	technologies: string[];
	repositories: { label: string; url: string }[];
}

export interface LlmsData {
	name: string;
	role: string;
	summary: string;
	about: string;
	location: string | null;
	github: string | null;
	linkedin: string | null;
	experiences: LlmsExperience[];
	projects: LlmsProject[];
}

const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

function spanText(child: unknown): string {
	return typeof child === "object" &&
		child !== null &&
		"text" in child &&
		typeof child.text === "string"
		? child.text
		: "";
}

// Converts Sanity portable text blocks to plain paragraphs
export function portableTextToPlain(
	blocks: readonly unknown[] | null | undefined,
): string {
	return (blocks ?? [])
		.map((block) => {
			if (
				typeof block !== "object" ||
				block === null ||
				!("children" in block) ||
				!Array.isArray(block.children)
			) {
				return "";
			}
			return block.children.map(spanText).join("").trim();
		})
		.filter(Boolean)
		.join("\n\n");
}

export function buildLlmsTxt(d: LlmsData, siteUrl: string): string {
	const lines = [
		`# ${d.name}`,
		"",
		`> ${oneLine(d.summary)}`,
		"",
		"## Pages",
		"",
		`- [Home](${absoluteUrl("/", siteUrl)}): About me, experience and featured projects`,
		`- [Projects](${absoluteUrl("/projects", siteUrl)}): All projects with their repositories`,
		"",
	];

	if (d.projects.length > 0) {
		lines.push("## Projects", "");
		for (const p of d.projects) {
			lines.push(
				`- [${p.title}](${absoluteUrl(`/projects/${p.slug}`, siteUrl)}): ${oneLine(p.description)}`,
			);
		}
		lines.push("");
	}

	lines.push(
		"## Optional",
		"",
		`- [Full content in one file](${absoluteUrl("/llms-full.txt", siteUrl)}): Everything on this site as plain text`,
	);
	if (d.github) lines.push(`- [GitHub](${d.github}): Source code`);
	if (d.linkedin)
		lines.push(`- [LinkedIn](${d.linkedin}): Professional profile`);

	return `${lines.join("\n")}\n`;
}

export function buildLlmsFullTxt(d: LlmsData, siteUrl: string): string {
	const lines = [`# ${d.name}`, "", `> ${oneLine(d.summary)}`, ""];
	lines.push(`${d.role}${d.location ? `, ${d.location}` : ""}`, "");

	if (d.about) lines.push("## About", "", d.about, "");

	if (d.experiences.length > 0) {
		lines.push("## Experience", "");
		for (const e of d.experiences) {
			const end = e.dateEnd ? formatMonthYear(e.dateEnd) : "Present";
			lines.push(
				`### ${e.jobTitle}, ${e.enterprise}`,
				"",
				`${formatMonthYear(e.dateStart)} to ${end}`,
				"",
				e.description,
				"",
			);
		}
	}

	if (d.projects.length > 0) {
		lines.push("## Projects", "");
		for (const p of d.projects) {
			lines.push(
				`### ${p.title}`,
				"",
				absoluteUrl(`/projects/${p.slug}`, siteUrl),
				"",
				p.description,
				"",
			);
			if (p.technologies.length > 0) {
				lines.push(`Technologies: ${p.technologies.join(", ")}`, "");
			}
			if (p.repositories.length > 0) {
				lines.push("Repositories:", "");
				for (const r of p.repositories) lines.push(`- ${r.label}: ${r.url}`);
				lines.push("");
			}
		}
	}

	if (d.github || d.linkedin) {
		lines.push("## Links", "");
		if (d.github) lines.push(`- GitHub: ${d.github}`);
		if (d.linkedin) lines.push(`- LinkedIn: ${d.linkedin}`);
		lines.push("");
	}

	return `${lines.join("\n").trimEnd()}\n`;
}
