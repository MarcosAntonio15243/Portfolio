"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProjectCardData } from "@/lib/project-data";

interface ProjectListCardProps {
	project: ProjectCardData;
}

const PLACEHOLDER_SVG = "/assets/project-placeholder.svg";

export function ProjectListCard({ project }: ProjectListCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imgSrc, setImgSrc] = useState(project.imageUrl);

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
				{project.technologies.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{project.technologies.slice(0, 4).map((tech) => (
							<span
								key={tech}
								className="text-[10px] font-roboto uppercase tracking-wide px-2 py-0.5 bg-[var(--color-bg-image)] text-[var(--color-text-primary)] border-[1px] border-[var(--color-border)]"
							>
								{tech}
							</span>
						))}
					</div>
				)}
				<h3 className="text-base font-semibold leading-tight group-hover:underline underline-offset-2">
					{project.title}
				</h3>
				<p className="text-sm text-[var(--color-text-primary)] line-clamp-2 leading-relaxed font-roboto">
					{project.description}
				</p>
				<div className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t-[1px] border-[var(--color-border)]">
					{project.repos.map((r) => (
						<span
							key={r.url}
							className="text-[10px] font-roboto uppercase tracking-wide px-2 py-0.5 border-[1px] border-[var(--color-border)] text-[var(--color-gray-400)]"
						>
							{r.label}
						</span>
					))}
				</div>
			</div>
			<div className="px-4 pb-3 flex items-center gap-1 text-xs font-medium text-[var(--color-link)] font-roboto transition-opacity -mt-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
				See more <ArrowUpRight className="size-3" />
			</div>
		</Link>
	);
}
