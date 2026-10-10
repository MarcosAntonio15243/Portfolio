import { buildLlmsTxt } from "@/lib/llms/format";
import { loadLlmsData } from "@/lib/llms/load";
import { SITE_URL } from "@/lib/seo/site";

export const revalidate = 3600;

export async function GET() {
	const body = buildLlmsTxt(await loadLlmsData(), SITE_URL);
	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
