import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { CiLinkedin } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { ExperienceCard, ProjectCard } from "@/components/cards";
import { CurriculumVitaeDropdown } from "@/components/dropdown";
import { Header } from "@/components/layout";
import { Divider } from "@/components/ui";
import { resolveProjectCard } from "@/lib/project-data";
import { formatMonthYear } from "@/lib/projects";
import {
	getExperiences,
	getFeaturedProjects,
	getSiteSettings,
} from "@/lib/sanity/queries";

export const revalidate = 3600;

export default async function Home() {
	const currentYear = new Date().getFullYear();

	const [settings, experiences, featured] = await Promise.all([
		getSiteSettings(),
		getExperiences(),
		getFeaturedProjects(),
	]);
	const projects = await Promise.all(featured.map(resolveProjectCard));

	return (
		<div>
			<Header />
			<main className="pt-12 flex flex-col justify-center items-center">
				<div
					id="home"
					className="mx-6 max-content-w flex flex-col gap-10 py-10"
				>
					{/* Presentation Section */}
					<section className="flex flex-col text-center sm:text-left sm:flex-row gap-5 items-center">
						<Image
							src={settings?.profileImageUrl ?? "/assets/profile.svg"}
							alt="Profile photo of Marcos Antonio"
							height={200}
							width={200}
							className="rounded-full"
						/>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-0 text-3xl">
								<h1 className="text-[var(--color-black)]">
									{settings?.headline}
								</h1>
								<h2 className="text-[var(--color-gray-400)]">
									{settings?.subheadline}
								</h2>
							</div>
							<p>{settings?.intro}</p>
							<a
								href={`mailto:${settings?.email}`}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Send email to Marcos"
								className="max-sm:mx-auto"
							>
								<span className="text-sm font-roboto font-normal underline underline-offset-4 flex flex-row items-center gap-1 tracking-wide">
									Contact Me <ArrowUpRight className="size-4" />
								</span>
							</a>
						</div>
					</section>

					{/* Localization and CV */}
					<div className="flex flex-col gap-2 sm:flex-row justify-between items-center text-sm text-[var(--color-text-primary)] border-y-[1px] py-3 px-2 border-[var(--color-border)]">
						<div className="flex flex-row items-center gap-1 text-[var(--color-text-primary)]">
							<IoLocationOutline className="sm:text-xl" size={16} />{" "}
							{settings?.location}
						</div>
						<CurriculumVitaeDropdown links={settings?.cvLinks ?? []} />
					</div>

					{/* About Me Section */}
					<section id="about" className="flex flex-col gap-4 font-roboto">
						<h2>About Me</h2>
						<div className="flex flex-col gap-4 p-4 bg-[var(--color-bg-card)] leading-relaxed border-[1px] border-[var(--color-bg-image)]">
							{settings?.about && (
								<PortableText
									value={settings.about}
									components={{
										block: { normal: ({ children }) => <p>{children}</p> },
										marks: {
											strong: ({ children }) => (
												<span className="bold">{children}</span>
											),
										},
									}}
								/>
							)}
						</div>
					</section>

					<Divider />

					{/* My Experience Section */}
					<section id="experience" className="flex flex-col gap-5">
						<h2>My Experience</h2>
						<div className="flex flex-col gap-4 my-5">
							{experiences.map((e) => (
								<ExperienceCard
									key={e._id}
									jobTitle={e.jobTitle}
									enterprise={e.enterprise}
									dateStart={formatMonthYear(e.dateStart)}
									dateEnd={e.dateEnd ? formatMonthYear(e.dateEnd) : null}
									description={e.description}
								/>
							))}
						</div>
					</section>

					<Divider />

					{/* Featured Projects Section */}
					<section id="projects" className="flex flex-col gap-5">
						<div className="flex flex-row justify-between">
							<h2>Featured Project</h2>
							<Link
								href="/projects"
								className="flex items-center gap-1 flex-row font-roboto font-light self-center px-4 py-1.5 cursor-pointer hover:text-[var(--color-dark-gray)] underline underline-offset-2"
							>
								See all projects <ArrowUpRight className="size-4" />
							</Link>
						</div>

						<div className="flex flex-col gap-8 my-5">
							{projects.map((p) => (
								<ProjectCard
									key={p.slug}
									slug={p.slug}
									srcImg={p.imageUrl}
									projectTitle={p.title}
									description={p.description}
									tecnologies={p.technologies}
								/>
							))}
						</div>
						<a
							href="https://github.com/MarcosAntonio15243?tab=repositories"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Link to github repositories of Marcos"
							className="font-roboto font-light self-center px-4 py-1.5 cursor-pointer hover:text-[var(--color-dark-gray)] underline underline-offset-2"
						>
							<span className="flex flex-row items-center gap-1">
								<span>See other projects on my GitHub</span>
								<FiGithub />
								<LuSquareArrowOutUpRight />
							</span>
						</a>
					</section>

					<Divider />

					<section id="contact" className="flex flex-col gap-5">
						<h2>Contact Me</h2>
						<p>{settings?.contactText}</p>
						<a
							href={`mailto:${settings?.email}`}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Send email to Marcos"
							className="button font-roboto font-light self-center px-4 py-1.5 cursor-pointer"
						>
							Write Message
						</a>
					</section>

					{/* Footer */}
					<footer>
						<div className="flex flex-col gap-2 my-5 items-center text-[var(--color-text-primary)]">
							<div className="flex flex-row items-center gap-2">
								{settings?.githubUrl && (
									<a
										href={settings.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Link to github profile"
									>
										<FiGithub className="text-xl hover:text-[var(--color-dark-blue)]" />
									</a>
								)}
								{settings?.linkedinUrl && (
									<a
										href={settings.linkedinUrl}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Link to linkedin profile"
									>
										<CiLinkedin className="text-2xl hover:text-[var(--color-dark-blue)]" />
									</a>
								)}
							</div>
							<span className="text-[var(--color-text-primary)]">
								Marcos Antonio - {currentYear}
							</span>
						</div>
					</footer>
				</div>
			</main>
		</div>
	);
}
