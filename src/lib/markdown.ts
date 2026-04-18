import type { Options as SanitizeOptions } from "rehype-sanitize";
import { defaultSchema } from "rehype-sanitize";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const sanitizeSchema: SanitizeOptions = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		img: ["src", "alt", "width", "height", "title"],
	},
	protocols: {
		...defaultSchema.protocols,
		src: ["https", "http"],
	},
};

// Convert markdown content into sanitized HTML with syntax highlighting
export async function markdownToHtml(markdown: string): Promise<string> {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeSanitize, sanitizeSchema)
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

// Replace relative image paths in markdown and HTML tags with absolute raw GitHub URLs
export function resolveMarkdownImageUrls(
	markdown: string,
	rawBase: string,
): string {
	// Handles markdown image syntax like ![alt](assets/image.png) and ![alt](./assets/image.png)
	const withMdResolved = markdown.replace(
		/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
		(_, alt, path) => {
			const cleanPath = path.replace(/^\.\//, "");
			return `![${alt}](${rawBase}/${cleanPath})`;
		},
	);

	// Handles HTML image tags like <img src="assets/image.png"> and <img src="./assets/image.png">
	return withMdResolved.replace(
		/<img([^>]+)src=["'](?!https?:\/\/)([^"']+)["']/gi,
		(_, before, path) => {
			const cleanPath = path.replace(/^\.\//, "");
			return `<img${before}src="${rawBase}/${cleanPath}"`;
		},
	);
}
