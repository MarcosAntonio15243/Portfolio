import { serializeJsonLd } from "@/lib/seo";

// The payload is built by our own helpers and "<" is escaped, so it cannot
// close the script tag
export function JsonLd({ data }: { data: unknown }) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized and escaped by serializeJsonLd
			dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
		/>
	);
}
