import { buildLlmsTxt } from "@/lib/llms";
import { loadLlmsData } from "@/lib/llms-data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
	const body = buildLlmsTxt(await loadLlmsData(), SITE_URL);
	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
