import { ImageResponse } from "next/og";
import { OWNER_JOB_TITLE, SITE_NAME } from "@/lib/seo/site";

export const alt = "Marcos Antonio, Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				padding: 80,
				background: "#111315",
				color: "#f4f4f5",
			}}
		>
			<div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.1 }}>
				{SITE_NAME}
			</div>
			<div style={{ fontSize: 48, marginTop: 24, color: "#3b82f6" }}>
				{OWNER_JOB_TITLE}
			</div>
		</div>,
		size,
	);
}
