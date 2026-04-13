import { fetchOgImageWithRetry } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory caching for the Node process.
const cache = new Map<string, { url: string | null; ts: number }>();
const CACHE_TTL = 3600 * 1000; // 1h

// Queue to prevent more than 1 simultaneous request per slug.
const inFlight = new Map<string, Promise<string | null>>();

export async function GET(req: NextRequest) {
	const slug = req.nextUrl.searchParams.get("slug");
	if (!slug) {
		return NextResponse.json({ error: "Missing slug" }, { status: 400 });
	}

	// Cache hit
	const cached = cache.get(slug);
	if (cached && Date.now() - cached.ts < CACHE_TTL) {
		return NextResponse.json({ url: cached.url });
	}

	// Deduplicate simultaneous requests for the same slug
	if (!inFlight.has(slug)) {
		const promise = fetchOgImageWithRetry(slug).then((url) => {
			cache.set(slug, { url, ts: Date.now() });
			inFlight.delete(slug);
			return url;
		});
		inFlight.set(slug, promise);
	}

	const url = await inFlight.get(slug)!;

	return NextResponse.json(
		{ url },
		{
			headers: {
				"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
			},
		},
	);
}
