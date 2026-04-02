"use client";

import { ArrowUpRight, GitFork, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { GithubRepo } from "@/lib/github";
import { LANGUAGE_COLORS } from "@/lib/github";

interface ProjectListCardProps {
	repo: GithubRepo;
}

const PLACEHOLDER_SVG = "/assets/project-placeholder.svg";

export function ProjectListCard({ repo }: ProjectListCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const langColor = repo.language ? LANGUAGE_COLORS[repo.language] : null;
	const updatedAt = new Date(repo.updated_at).toLocaleDateString(undefined, {
		month: "short",
		year: "numeric",
	});

	return (
		<Link
			href={`/projects/${repo.name}`}
			className="group flex flex-col border-[1px] border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-card)] transition-colors overflow-hidden"
		>
			{/* Imagem com skeleton */}
			<div className="relative w-full aspect-video overflow-hidden bg-[var(--color-bg-image)]">
				{/* Skeleton enquanto carrega */}
				{!imageLoaded && (
					<div className="absolute inset-0 bg-[var(--color-bg-image)] animate-pulse" />
				)}
				<Image
					src={repo.open_graph_image_url || PLACEHOLDER_SVG}
					alt={`Preview de ${repo.name}`}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className={`object-cover transition-all duration-500 group-hover:scale-105 ${
						imageLoaded ? "opacity-100" : "opacity-0"
					}`}
					quality={85}
					onLoad={() => setImageLoaded(true)}
				/>
			</div>

			{/* Conteúdo — skeleton se ainda carregando */}
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

				<h3 className="text-base font-semibold leading-tight group-hover:underline underline-offset-2">
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
					<span className="text-[10px] text-[var(--color-gray-400)] font-roboto">
						{updatedAt}
					</span>
				</div>
			</div>

			<div className="px-4 pb-3 flex items-center gap-1 text-xs font-medium text-[var(--color-link)] font-roboto opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
				See more <ArrowUpRight className="size-3" />
			</div>
		</Link>
	);
}
