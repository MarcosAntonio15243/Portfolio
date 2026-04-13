type QueueItem = {
	slug: string;
	resolve: (url: string | null) => void;
};

const cache = new Map<string, string | null>();
const queue: QueueItem[] = [];
let isRunning = false;

const DELAY_BETWEEN_REQUESTS = 300; // ms between each fetch

async function processQueue() {
	if (isRunning) return;
	isRunning = true;

	while (queue.length > 0) {
		const item = queue.shift()!;

		// Cache hit — no delay expected
		if (cache.has(item.slug)) {
			item.resolve(cache.get(item.slug)!);
			continue;
		}

		try {
			const res = await fetch(
				`/api/og-image?slug=${encodeURIComponent(item.slug)}`,
			);
			const data = await res.json();
			const url = data.url ?? null;
			cache.set(item.slug, url);
			item.resolve(url);
		} catch {
			cache.set(item.slug, null);
			item.resolve(null);
		}

		// Pause between requests to avoid overloading the server
		if (queue.length > 0) {
			await new Promise((r) => setTimeout(r, DELAY_BETWEEN_REQUESTS));
		}
	}

	isRunning = false;
}

export function enqueueOgImage(slug: string): Promise<string | null> {
	// Immediate cache hit
	if (cache.has(slug)) {
		return Promise.resolve(cache.get(slug)!);
	}

	// Already in line
	const alreadyQueued = queue.find((item) => item.slug === slug);
	if (alreadyQueued) {
		return new Promise((resolve) => {
			queue.push({ slug, resolve });
		});
	}

	return new Promise((resolve) => {
		queue.push({ slug, resolve });
		processQueue();
	});
}
