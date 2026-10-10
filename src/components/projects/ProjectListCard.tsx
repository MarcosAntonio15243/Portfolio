"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LANGUAGE_COLORS } from "@/lib/github";
import type { ProjectCardData } from "@/lib/project-data";
import { LocaleDate } from "../date/LocaleDate";

interface ProjectListCardProps {
	project: ProjectCardData;
}

const PLACEHOLDER_SVG = "/assets/project-placeholder.svg";

export function ProjectListCard({ project }: ProjectListCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imgSrc, setImgSrc] = useState(project.imageUrl);

	// Main technology only, or the first ones when the CMS lists several
	const technologies =
		project.technologies.length > 0
			? project.technologies.slice(0, 3)
			: project.mainLanguage
				? [project.mainLanguage]
				: [];

	return (
		<Link
			href={`/projects/${project.slug}`}
			className="group flex flex-col border-[1px] border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-card)] transition-colors overflow-hidden"
		>
			<div className="relative w-full aspect-video overflow-hidden bg-[var(--color-bg-image)]">
				{!imageLoaded && (
					<div className="absolute inset-0 bg-[var(--color-bg-image)] animate-pulse" />
				)}
				<Image
					src={imgSrc}
					alt={`Preview of ${project.title}`}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw"
					className={`object-cover transition-all duration-500 group-hover:scale-105 ${
						imageLoaded ? "opacity-100" : "opacity-0"
					}`}
					quality={85}
					onLoad={() => setImageLoaded(true)}
					onError={() => {
						setImgSrc(PLACEHOLDER_SVG);
						setImageLoaded(true);
					}}
				/>
			</div>

			<div className="flex flex-col gap-2 p-4 flex-1">
				<h3 className="text-base font-semibold leading-tight group-hover:underline underline-offset-2">
					{project.title}
				</h3>
				<p className="text-sm text-[var(--color-text-primary)] line-clamp-2 leading-relaxed font-roboto">
					{project.description}
				</p>
				<div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t-[1px] border-[var(--color-border)]">
					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-gray-400)]">
						{technologies.map((tech) => (
							<span key={tech} className="flex items-center gap-1">
								<span
									className="inline-block w-2.5 h-2.5 rounded-full"
									style={{ backgroundColor: LANGUAGE_COLORS[tech] || "#888" }}
								/>
								{tech}
							</span>
						))}
					</div>
					{project.updatedAt && (
						<LocaleDate
							dateString={project.updatedAt}
							options={{ month: "short", year: "numeric" }}
							className="text-[10px] text-[var(--color-gray-400)] font-roboto shrink-0"
						/>
					)}
				</div>
			</div>
			<div className="px-4 pb-3 flex items-center gap-1 text-xs font-medium text-[var(--color-link)] font-roboto transition-opacity -mt-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
				See more <ArrowUpRight className="size-3" />
			</div>
		</Link>
	);
}
