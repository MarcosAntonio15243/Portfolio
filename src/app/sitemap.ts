import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/sanity/queries";
import { buildSitemap } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const projects = await getAllProjects();
	return buildSitemap(projects, SITE_URL);
}
