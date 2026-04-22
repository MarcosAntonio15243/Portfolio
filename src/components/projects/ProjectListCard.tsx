"use client";

import { ArrowUpRight, GitFork, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { GithubRepo } from "@/lib/github";
import { LANGUAGE_COLORS } from "@/lib/github";
import { LocaleDate } from "../date/LocaleDate";

interface ProjectListCardProps {
	repo: GithubRepo;
}

const PLACEHOLDER_SVG = "/assets/project-placeholder.svg";

export function ProjectListCard({ repo }: ProjectListCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imgSrc, setImgSrc] = useState(
		repo.open_graph_image_url || PLACEHOLDER_SVG,
	);

	const langColor = repo.language ? LANGUAGE_COLORS[repo.language] : null;

	return (
		<Link
			href={`/projects/${repo.name}`}
			className="group flex flex-col border-[1px] border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-card)] transition-colors overflow-hidden"
		>
			<div className="relative w-full aspect-video overflow-hidden bg-[var(--color-bg-image)]">
				{!imageLoaded && (
					<div className="absolute inset-0 bg-[var(--color-bg-image)] animate-pulse" />
				)}
				<Image
					src={imgSrc}
					alt={`Preview de ${repo.name}`}
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
				{repo.topics.filter((t) => t !== "portfolio").length > 0 && (
					<div className="flex flex-wrap gap-1">
						{repo.topics
							.filter((t) => t !== "portfolio")
							.slice(0, 4)
							.map((topic) => (
								<span
									key={topic}
									className="text-[10px] font-roboto uppercase tracking-wide px-2 py-0.5 bg-[var(--color-bg-image)] text-[var(--color-text-primary)] border-[1px] border-[var(--color-border)]"
								>
									{topic}
								</span>
							))}
					</div>
				)}
				<h3 className="text-base capitalize font-semibold leading-tight group-hover:underline underline-offset-2">
					{repo.name.replace(/-/g, " ")}
				</h3>
				{repo.description && (
					<p className="text-sm text-[var(--color-text-primary)] line-clamp-2 leading-relaxed font-roboto">
						{repo.description}
					</p>
				)}
				<div className="flex items-center justify-between mt-auto pt-3 border-t-[1px] border-[var(--color-border)]">
					<div className="flex items-center gap-3 text-xs text-[var(--color-gray-400)]">
						{repo.language && (
							<span className="flex items-center gap-1">
								<span
									className="inline-block w-2.5 h-2.5 rounded-full"
									style={{ backgroundColor: langColor || "#888" }}
								/>
								{repo.language}
							</span>
						)}
						{repo.stargazers_count > 0 && (
							<span className="flex items-center gap-1">
								<Star className="size-3" />
								{repo.stargazers_count}
							</span>
						)}
						{repo.forks_count > 0 && (
							<span className="flex items-center gap-1">
								<GitFork className="size-3" />
								{repo.forks_count}
							</span>
						)}
					</div>
					<LocaleDate
						dateString={repo.updated_at}
						options={{ month: "short", year: "numeric" }}
						className="text-[10px] text-[var(--color-gray-400)] font-roboto"
					/>
				</div>
			</div>
			<div className="px-4 pb-3 flex items-center gap-1 text-xs font-medium text-[var(--color-link)] font-roboto transition-opacity -mt-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
				See more <ArrowUpRight className="size-3" />
			</div>
		</Link>
	);
}
