export interface BatchOptions {
	concurrency?: number; // Number of parallel requests per batch
	retries?: number; // Retry attempts per item
	baseDelay?: number; // Initial delay in milliseconds
	jitter?: boolean; // Adds random variation to delay intervals
}

async function fetchWithRetry(
	url: string,
	retries: number,
	baseDelay: number,
	jitter: boolean,
): Promise<string | null> {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url, {
				headers: { "User-Agent": "portfolio-bot" },
				next: { revalidate: 3600 },
			});

			if (res.status === 429) {
				if (attempt >= retries) return null;
				const retryAfter = res.headers.get("Retry-After");
				const delay = retryAfter
					? parseInt(retryAfter) * 1000
					: baseDelay * Math.pow(2, attempt);
				await sleep(delay, jitter);
				continue;
			}

			if (!res.ok) return null;

			const html = await res.text();
			const match = html.match(/<meta property="og:image"\s+content="([^"]+)"/);
			return match?.[1] ?? null;
		} catch {
			if (attempt < retries)
				await sleep(baseDelay * Math.pow(2, attempt), jitter);
		}
	}
	return null;
}

function sleep(ms: number, jitter = false) {
	const delay = jitter ? ms + Math.random() * ms * 0.3 : ms;
	return new Promise((r) => setTimeout(r, delay));
}

// Processes an array in batches with a limited number of concurrent requests
export async function fetchOgImagesBatch(
	fullNames: string[],
	options: BatchOptions = {},
): Promise<Record<string, string | null>> {
	const {
		concurrency = 4,
		retries = 3,
		baseDelay = 800,
		jitter = true,
	} = options;

	const results: Record<string, string | null> = {};

	// Splits the array into chunks based on the concurrency limit
	for (let i = 0; i < fullNames.length; i += concurrency) {
		const chunk = fullNames.slice(i, i + concurrency);

		const settled = await Promise.allSettled(
			chunk.map((name) =>
				fetchWithRetry(
					`https://github.com/${name}`,
					retries,
					baseDelay,
					jitter,
				).then((url) => ({ name, url })),
			),
		);

		for (const result of settled) {
			if (result.status === "fulfilled") {
				results[result.value.name] = result.value.url;
			} else {
				// Item failed even after all retries — store null as fallback
				const idx = settled.indexOf(result);
				results[chunk[idx]] = null;
			}
		}

		// Pause between batches to reduce the chance of hitting rate limits
		if (i + concurrency < fullNames.length) {
			await sleep(300, true);
		}
	}

	return results;
}
