import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Converte markdown para HTML seguro
export async function markdownToHtml(markdown: string): Promise<string> {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeSanitize)
		.use(rehypeStringify)
		.process(markdown);

	return String(result);
}

// Extrai seções do README por heading (ex: "como rodar", "installation", "usage")
export function extractSection(
	markdown: string,
	headings: string[],
): string | null {
	const lines = markdown.split("\n");
	const lower = headings.map((h) => h.toLowerCase());

	let capturing = false;
	let depth = 0;
	const captured: string[] = [];

	for (const line of lines) {
		const headingMatch = line.match(/^(#{1,6})\s+(.+)/);

		if (headingMatch) {
			const currentDepth = headingMatch[1].length;
			const title = headingMatch[2].toLowerCase().trim();
			const isTarget = lower.some(
				(h) => title.includes(h) || h.includes(title),
			);

			if (isTarget) {
				capturing = true;
				depth = currentDepth;
				captured.push(line);
				continue;
			}

			if (capturing && currentDepth <= depth) {
				break;
			}
		}

		if (capturing) {
			captured.push(line);
		}
	}

	return captured.length > 0 ? captured.join("\n") : null;
}

// Remove badges/shields do início do README (deixa mais limpo na descrição)
export function stripBadges(markdown: string): string {
	return markdown
		.replace(/\[!\[.*?\]\(https?:\/\/.*?\)\]\(.*?\)/g, "")
		.replace(
			/!\[.*?\]\(https?:\/\/(img\.shields\.io|badge\.fury\.io).*?\)/g,
			"",
		)
		.trim();
}
