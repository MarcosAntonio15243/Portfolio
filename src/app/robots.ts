import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/seo/crawlers";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
	return buildRobots(SITE_URL);
}
