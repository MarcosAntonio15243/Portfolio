import {
	ArrowLeft,
	ArrowUpRight,
	ExternalLink,
	GitFork,
	Star,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiGithub } from "react-icons/fi";
import { LocaleDate } from "@/components/date/LocaleDate";
import { Header } from "@/components/layout";
import { ImageModalTrigger } from "@/components/projects/ImageModalTrigger";
import { ReadmeViewer } from "@/components/projects/ReadmeViewer";
import { RepoTabs } from "@/components/projects/RepoTabs";
import { JsonLd } from "@/components/seo";
import { Divider, TechnologyDot } from "@/components/ui";
import { getRepoDetail, getRepoMeta, LANGUAGE_COLORS } from "@/lib/github";
import {
	markdownToHtml,
	resolveMarkdownImageUrls,
	stripBadges,
} from "@/lib/markdown";
import { resolveProjectDescription } from "@/lib/projects/card-data";
import {
	cleanTechnologies,
	normalizeRepo,
	pickMainImage,
	resolveDescription,
	selectRepo,
	tabId,
} from "@/lib/projects/helpers";
import { getProjectBySlug } from "@/lib/sanity/queries";
import { buildBreadcrumbJsonLd, buildProjectJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";

interface Props {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ repo?: string | string[] }>;
}

const PLACEHOLDER_SVG = "/assets/project-placeholder.svg";

export async function generateMetadata({
	params,
}: Pick<Props, "params">): Promise<Metadata> {
	const { slug } = await params;
	const project = await getProjectBySlug(slug);
	if (!project) return {};
	return pageMetadata({
		title: project.title,
		description: await resolveProjectDescription(project),
		path: `/projects/${project.slug}`,
	});
}

export default async function ProjectDetailPage({
	params,
	searchParams,
}: Props) {
	const { slug } = await params;
	const { repo: repoParam } = await searchParams;
	const tab = Array.isArray(repoParam) ? repoParam[0] : repoParam;

	const project = await getProjectBySlug(slug);
	if (!project) notFound();

	const repos = project.repositories
		.map((r) => ({ label: r.label, full: normalizeRepo(r.repo) }))
		.filter((r): r is { label: string; full: string } => r.full !== null);
	if (repos.length === 0) notFound();

	const selected = selectRepo(
		repos.map((r) => ({ label: r.label, repo: r.full })),
		tab,
	);
	const tabs = repos.map((r) => ({ id: tabId(r.label), label: r.label }));

	const repo = await getRepoDetail(selected.repo);
	const technologies = cleanTechnologies(project.technologies);

	// Description: CMS summary, then GitHub descriptions in array order
	const fallbackDescriptions = project.summary?.trim()
		? []
		: (await Promise.all(repos.map((r) => getRepoMeta(r.full)))).map(
				(m) => m?.description,
			);
	const description = resolveDescription(project.summary, fallbackDescriptions);

	const rawBase = repo
		? `https://raw.githubusercontent.com/${repo.full_name.split("/")[0]}/${repo.name}/${repo.default_branch}`
		: "";

	// Process the README
	const cleanReadme = repo?.readme
		? resolveMarkdownImageUrls(stripBadges(repo.readme), rawBase)
		: null;

	// Convert Markdown to HTML (full README and run section)
	const readmeHtml = cleanReadme ? await markdownToHtml(cleanReadme) : null;

	// Languages by percentage
	const languages = repo?.languages ?? {};
	const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
	const langPercents = totalBytes
		? Object.entries(languages).map(([lang, bytes]) => ({
				lang,
				pct: ((bytes / totalBytes) * 100).toFixed(1),
				color: LANGUAGE_COLORS[lang] || "#888",
			}))
		: [];

	const mainImage = pickMainImage(
		{
			coverUrl: project.coverUrl,
			ogImage: repo?.open_graph_image_url,
			readmeImages: repo?.images,
		},
		PLACEHOLDER_SVG,
	);
	const galleryImages = (repo?.images ?? []).slice(0, 6); // max 6 images

	return (
		<div>
			<JsonLd
				data={buildProjectJsonLd({
					name: project.title,
					description,
					url: absoluteUrl(`/projects/${project.slug}`),
					repositories: repos.map((r) => `https://github.com/${r.full}`),
					languages: technologies.map((t) => t.name),
					authorUrl: absoluteUrl("/"),
				})}
			/>
			<JsonLd
				data={buildBreadcrumbJsonLd([
					{ name: "Home", url: absoluteUrl("/") },
					{ name: "Projects", url: absoluteUrl("/projects") },
					{
						name: project.title,
						url: absoluteUrl(`/projects/${project.slug}`),
					},
				])}
			/>
			<Header />
			<main className="pt-12 flex flex-col justify-center items-center">
				<div className="mx-6 max-content-w flex flex-col gap-10 py-10">
					<Link
						href="/projects"
						className="flex items-center gap-1.5 text-sm font-roboto text-[var(--color-gray-400)] hover:text-[var(--color-text-primary)] transition-colors w-fit"
					>
						<ArrowLeft className="size-4" /> Back to projects
					</Link>

					{/* Project Header */}
					<section className="flex flex-col gap-4">
						{/* Technologies */}
						{technologies.length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								{technologies.map((tech) => (
									<span
										key={tech.name}
										className="flex items-center gap-1.5 text-[10px] font-roboto uppercase tracking-widest px-2 py-0.5 border-[1px] border-[var(--color-border)] text-[var(--color-gray-400)]"
									>
										<TechnologyDot color={tech.color} />
										{tech.name}
									</span>
								))}
							</div>
						)}

						<h1 className="name">{project.title}</h1>

						<p className="font-roboto text-[var(--color-text-primary)] leading-relaxed">
							{description}
						</p>

						{/* Stats and links */}
						<div className="flex flex-wrap items-center gap-4 text-sm">
							{repo && (
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
									<span className="text-xs flex gap-1">
										Last updated:
										<LocaleDate
											dateString={repo.updated_at}
											options={{
												day: "2-digit",
												month: "long",
												year: "numeric",
											}}
										/>
									</span>
								</div>
							)}

							<div className="flex items-center gap-3 ml-auto">
								{repo?.homepage && (
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
									href={`https://github.com/${selected.repo}`}
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

						<RepoTabs slug={slug} tabs={tabs} active={tabId(selected.label)} />
					</section>

					{/* Main Image */}
					<div className="relative w-full aspect-video bg-[var(--color-bg-image)] border-[1px] border-[var(--color-bg-image)] overflow-hidden">
						<Image
							src={mainImage}
							alt={`Project Preview ${project.title}`}
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
									<ImageModalTrigger key={src} src={src} index={i} />
								))}
							</div>
						</section>
					)}

					{galleryImages.length > 0 && <Divider />}

					{/* Full README */}
					{readmeHtml && (
						<section className="flex flex-col gap-4">
							<h2>Documentation</h2>
							<div className="p-4 bg-[var(--color-bg-card)] border-[1px] border-[var(--color-bg-image)]">
								<ReadmeViewer html={readmeHtml} />
							</div>
						</section>
					)}

					{!repo && (
						<div className="text-center py-10 text-[var(--color-gray-400)] font-roboto text-sm">
							Could not load {selected.label} from GitHub right now. Try again
							later.
						</div>
					)}

					{repo && !readmeHtml && (
						<div className="text-center py-10 text-[var(--color-gray-400)] font-roboto text-sm">
							This repository has no README.
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
