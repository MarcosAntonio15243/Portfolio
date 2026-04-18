import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Convert markdown content into sanitized HTML with syntax highlighting
export async function markdownToHtml(markdown: string): Promise<string> {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeSanitize)
		.use(rehypePrettyCode, {
			theme: { dark: "github-dark", light: "github-light" },
			keepBackground: false,
		})
		.use(rehypeStringify)
		.process(markdown);

	return String(result);
}

// Remove badges and shields from the beginning of the README for a cleaner description
export function stripBadges(markdown: string): string {
	return markdown
		.replace(/\[!\[.*?\]\(https?:\/\/.*?\)\]\(.*?\)/g, "")
		.replace(
			/!\[.*?\]\(https?:\/\/(img\.shields\.io|badge\.fury\.io).*?\)/g,
			"",
		)
		.trim();
}
