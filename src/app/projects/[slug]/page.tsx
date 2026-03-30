import {
	ArrowLeft,
	ArrowUpRight,
	ExternalLink,
	GitFork,
	Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout";
import { Divider } from "@/components/ui";
import { ReadmeViewer } from "@/components/projects/ReadmeViewer";
import { getRepoDetail, LANGUAGE_COLORS } from "@/lib/github";
import { extractSection, markdownToHtml, stripBadges } from "@/lib/markdown";
import { FiGithub } from "react-icons/fi";
import { ImageModalTrigger } from "@/components/projects/ImageModalTrigger";

export const revalidate = 0;

interface Props {
	params: { slug: string };
}

const PLACEHOLDER_SVG = "/assets/project-placeholder.svg";

export default async function ProjectDetailPage({ params }: Props) {
	const repo = await getRepoDetail(params.slug);

	if (!repo) notFound();

	// Process the README
	const cleanReadme = repo.readme ? stripBadges(repo.readme) : null;

	// Extract section "how to run" / "getting started" / "installation"
	const runSection = cleanReadme
		? extractSection(cleanReadme, [
				"como rodar",
				"como executar",
				"getting started",
				"installation",
				"instalação",
				"setup",
				"running",
				"usage",
				"como usar",
			])
		: null;

	// Convert Markdown to HTML (full README and run section)
	const [readmeHtml, runHtml] = await Promise.all([
		cleanReadme ? markdownToHtml(cleanReadme) : Promise.resolve(null),
		runSection ? markdownToHtml(runSection) : Promise.resolve(null),
	]);

	// Languages by percentage
	const totalBytes = Object.values(repo.languages).reduce((a, b) => a + b, 0);
	const langPercents = Object.entries(repo.languages).map(([lang, bytes]) => ({
		lang,
		pct: ((bytes / totalBytes) * 100).toFixed(1),
		color: LANGUAGE_COLORS[lang] || "#888",
	}));

	// Main image: og-image or first image from README
	const mainImage = repo.open_graph_image_url || repo.images[0] || null;
	const galleryImages = repo.images.slice(0, 6); // max 6 images

	const updatedAt = new Date(repo.updated_at).toLocaleDateString("en", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});

	return (
		<div>
			<Header />
			<main className="pt-12 flex flex-col justify-center items-center">
				<div className="mx-6 max-content-w flex flex-col gap-8 py-10 w-full">
					<Link
						href="/projects"
						className="flex items-center gap-1.5 text-sm font-roboto text-[var(--color-gray-400)] hover:text-[var(--color-text-primary)] transition-colors w-fit"
					>
						<ArrowLeft className="size-4" /> Back to projects
					</Link>

					{/* Project Header */}
					<section className="flex flex-col gap-4">
						{/* Topics */}
						{repo.topics.filter((t) => t !== "portfolio").length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								{repo.topics
									.filter((t) => t !== "portfolio")
									.map((topic) => (
										<span
											key={topic}
											className="text-[10px] font-roboto uppercase tracking-widest px-2 py-0.5 border-[1px] border-[var(--color-border)] text-[var(--color-gray-400)]"
										>
											{topic}
										</span>
									))}
							</div>
						)}

						<h1 className="text-2xl text-[var(--color-black)] capitalize">
							{repo.name.replace(/-/g, " ")}
						</h1>

						{repo.description && (
							<p className="font-roboto text-[var(--color-text-primary)] leading-relaxed">
								{repo.description}
							</p>
						)}

						{/* Stats and links */}
						<div className="flex flex-wrap items-center gap-4 text-sm">
							<div className="flex items-center gap-3 text-[var(--color-gray-400)]">
								{repo.stargazers_count > 0 && (
									<span className="flex items-center gap-1">
										<Star className="size-4" />
										{repo.stargazers_count}
									</span>
								)}
								{repo.forks_count > 0 && (
									<span className="flex items-center gap-1">
										<GitFork className="size-4" />
										{repo.forks_count}
									</span>
								)}
								<span className="text-xs">Last updated: {updatedAt}</span>
							</div>

							<div className="flex items-center gap-3 ml-auto">
								{repo.homepage && (
									<a
										href={repo.homepage}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 text-sm font-roboto font-medium underline underline-offset-4 text-[var(--color-link)]"
									>
										<ExternalLink className="size-4" /> Live Demo
									</a>
								)}
								<a
									href={repo.html_url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1.5 text-sm font-roboto font-medium underline underline-offset-4 text-[var(--color-link)]"
								>
									GitHub
									<FiGithub className="size-4" />
									<ArrowUpRight className="size-4" />
								</a>
							</div>
						</div>
					</section>

					{/* Main Image */}
					<div className="relative w-full aspect-video bg-[var(--color-bg-image)] border-[1px] border-[var(--color-bg-image)] overflow-hidden">
						<Image
							src={mainImage || PLACEHOLDER_SVG}
							alt={`Preview do projeto ${repo.name}`}
							fill
							sizes="(max-width: 768px) 100vw, 800px"
							className="object-cover object-top"
							quality={90}
							priority
						/>
					</div>

					{/* Languages */}
					{langPercents.length > 0 && (
						<div className="flex flex-col gap-2">
							{/* Language Bar */}
							<div className="flex h-2 w-full overflow-hidden rounded-full gap-0.5">
								{langPercents.map(({ lang, pct, color }) => (
									<div
										key={lang}
										style={{ width: `${pct}%`, backgroundColor: color }}
										title={`${lang}: ${pct}%`}
									/>
								))}
							</div>
							{/* Legend */}
							<div className="flex flex-wrap gap-x-4 gap-y-1">
								{langPercents.map(({ lang, pct, color }) => (
									<span
										key={lang}
										className="flex items-center gap-1.5 text-xs font-roboto text-[var(--color-text-primary)]"
									>
										<span
											className="inline-block w-2.5 h-2.5 rounded-full"
											style={{ backgroundColor: color }}
										/>
										{lang}{" "}
										<span className="text-[var(--color-gray-400)]">{pct}%</span>
									</span>
								))}
							</div>
						</div>
					)}

					<Divider />

					{/* Image Gallery from README */}
					{galleryImages.length > 0 && (
						<section className="flex flex-col gap-4">
							<h2>Project Image</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{galleryImages.map((src, i) => (
									<ImageModalTrigger key={i} src={src} index={i} />
								))}
							</div>
						</section>
					)}

					{galleryImages.length > 0 && <Divider />}

					{/* How to Run */}
					{runHtml && (
						<section className="flex flex-col gap-4" id="how-to-run">
							<h2>How to Run</h2>
							<div className="p-4 bg-[var(--color-bg-card)] border-[1px] border-[var(--color-bg-image)]">
								<ReadmeViewer html={runHtml} />
							</div>
						</section>
					)}

					{runHtml && readmeHtml && <Divider />}

					{/* Full README */}
					{readmeHtml && (
						<section className="flex flex-col gap-4">
							<h2>Documentation</h2>
							<div className="p-4 bg-[var(--color-bg-card)] border-[1px] border-[var(--color-bg-image)]">
								<ReadmeViewer html={readmeHtml} />
							</div>
						</section>
					)}

					{!readmeHtml && (
						<div className="text-center py-10 text-[var(--color-gray-400)] font-roboto text-sm">
							This repository has no README.
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

// Componente auxiliar client-side para a galeria com modal
// Como esta é uma Server Component, precisamos isolar o estado do modal
// Crie um arquivo separado: components/projects/ImageModalTrigger.tsx
// function ImageModalTrigger({ src, index }: { src: string; index: number }) {
// 	// ATENÇÃO: mova este componente para um arquivo client separado:
// 	// "use client"
// 	// import { useState } from "react"
// 	// import { ImageModal } from "@/components/ui/ImageModal"
// 	return (
// 		<div className="relative aspect-video overflow-hidden border-[1px] border-[var(--color-bg-image)] cursor-zoom-in">
// 			<Image
// 				src={src}
// 				alt={`Screenshot ${index + 1}`}
// 				fill
// 				sizes="(max-width: 640px) 100vw, 50vw"
// 				className="object-cover object-top"
// 				quality={85}
// 			/>
// 		</div>
// 	);
// }
