import { ImageResponse } from "next/og";
import { cleanTechnologies } from "@/lib/projects/helpers";
import { getProjectBySlug } from "@/lib/sanity/queries";
import { truncate } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";

export const alt = "Project preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = await getProjectBySlug(slug);
	// An unknown slug still returns a generic card instead of an error
	const title = truncate(project?.title ?? "Project", 70);
	const technologies = cleanTechnologies(project?.technologies).slice(0, 3);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: 80,
				background: "#111315",
				color: "#f4f4f5",
			}}
		>
			<div style={{ fontSize: 36, color: "#3b82f6" }}>{SITE_NAME}</div>
			<div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
				{title}
			</div>
			<div style={{ display: "flex", gap: 20, fontSize: 32 }}>
				{technologies.map((tech) => (
					<div
						key={tech.name}
						style={{
							display: "flex",
							padding: "8px 24px",
							border: "2px solid #3f3f46",
							borderRadius: 999,
						}}
					>
						{tech.name}
					</div>
				))}
			</div>
		</div>,
		size,
	);
}
