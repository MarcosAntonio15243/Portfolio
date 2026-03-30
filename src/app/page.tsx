import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { CiLinkedin } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { IoDocumentTextOutline, IoLocationOutline } from "react-icons/io5";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { ExperienceCard, ProjectCard } from "@/components/cards";
import { experiences, projects } from "@/components/data";
import { Header } from "@/components/layout";
import { Divider } from "@/components/ui";

export default function Home() {
	const currentYear = new Date().getFullYear();

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
							src="/assets/profile.svg"
							alt="Profile photo of Marcos Antonio"
							height={200}
							width={200}
							className="rounded-full"
						/>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-0 text-3xl">
								<h1 className="text-[var(--color-black)]">
									Hello, I am Marcos
								</h1>
								<h2 className="text-[var(--color-gray-400)]">
									A Full-Stack Developer
								</h2>
							</div>
							<p>
								Building complete solutions, combining the development of
								modern, functional interfaces with the implementation of robust
								back-end architectures
							</p>
							<a
								href="mailto:marcos.antonio.developer@gmail.com"
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
							<IoLocationOutline className="sm:text-xl" size={16} /> Campina
							Grande, Paraiba, Brazil
						</div>
						<a
							href="https://drive.google.com/file/d/1ZJId7DFc2nv3xRmkMtM1jL5_O-blAQ2L/view?usp=sharing"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Link to Curriculum Vitae of Marcos"
							className="font-roboto hover:underline"
						>
							<span className="flex items-center gap-1 flex-row">
								<span className="capitalize font-medium">Curriculum Vitae</span>
								<IoDocumentTextOutline size={15} />
								<ArrowUpRight className="size-4" />
							</span>
						</a>
					</div>

					{/* About Me Section */}
					<section id="about" className="flex flex-col gap-4 font-roboto">
						<h2>About Me</h2>
						<div className="flex flex-col gap-4 p-4 bg-[var(--color-bg-card)] leading-relaxed border-[1px] border-[var(--color-bg-image)]">
							<p>
								I started my journey in development in 2019 when I joined the
								technical course in Informatics at IFPB – Santa Luzia (PB).
								That’s where I had my first contact with web development,
								working with
								<span className="bold">HTML5</span>,{" "}
								<span className="bold">CSS3</span>, and{" "}
								<span className="bold">JavaScript</span>. Since then, I’ve been
								continuously building my skills, with a strong focus on modern
								frameworks, especially <span className="bold">React.js</span>,
								which has been my main development tool ever since.
							</p>
							<p>
								Over the years, I’ve deepened my knowledge of the React
								ecosystem, working with technologies like{" "}
								<span className="bold">TypeScript</span>,{" "}
								<span className="bold">Styled Components</span>,
								<span className="bold">Axios</span>, and{" "}
								<span className="bold">Next.js</span>, as well as databases like{" "}
								<span className="bold">PostgreSQL</span>. I also gained
								experience testing APIs with{" "}
								<span className="bold">Postman</span> and exploring{" "}
								<span className="bold">Oracle APEX</span>, which helped me
								broaden my understanding of web development and system
								integration.
							</p>
							<p>
								I'm passionate about <span className="bold">learning</span>,
								delivering{" "}
								<span className="bold">clean and efficient code</span>, and
								creating great <span className="bold">user experiences</span>. I
								believe my hands-on
								<span className="bold">experience</span>,{" "}
								<span className="bold">adaptability</span>, and{" "}
								<span className="bold">results-driven mindset</span> can bring
								value to any team — especially when it comes to building
								<span className="bold">responsive interfaces</span> and
								integrating systems seamlessly.
							</p>
							<p>
								I'm excited to take on new challenges, collaborate with
								passionate teams, and keep growing both personally and
								professionally.
							</p>
						</div>
					</section>

					<Divider />

					{/* My Experience Section */}
					<section id="experience" className="flex flex-col gap-5">
						<h2>My Experience</h2>
						<div className="flex flex-col gap-4 my-5">
							{experiences.map((e, index) => {
								return (
									<ExperienceCard
										key={`${index}-${e.jobTitle}`}
										jobTitle={e.jobTitle}
										enterprise={e.enterprise}
										dateStart={e.dateStart}
										dateEnd={e.dateEnd}
										description={e.description}
									/>
								);
							})}
						</div>
					</section>

					<Divider />

					{/* Featured Projects Section */}
					<section id="project" className="flex flex-col gap-5">
						<h2>Featured Project</h2>
						<div className="flex flex-col gap-8 my-5">
							{projects.map((e, index) => {
								return (
									<ProjectCard
										key={`${index}-${e.projectTitle}`}
										srcImg={e.srcImg}
										projectTitle={e.projectTitle}
										description={e.description}
										tecnologies={e.tecnologies}
										repositoryLink={e.repositoryLink}
									/>
								);
							})}
						</div>
						<a
							href="https://github.com/MarcosAntonio15243?tab=repositories"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Link to github repositories of Marcos"
							className="font-roboto font-light self-center px-4 py-1.5 cursor-pointer hover:text-[var(--color-dark-gray)] underline underline-offset-2"
						>
							<span className="flex flex-row items-center gap-1">
								<span>See other projects on my github</span>
								<FiGithub />
								<LuSquareArrowOutUpRight />
							</span>
						</a>
					</section>

					<Divider />

					<section id="contact" className="flex flex-col gap-5">
						<h2>Contact Me</h2>
						<p>
							Have an opportunity or a project in mind? feel free to get in
							touch.
						</p>
						<a
							href="mailto:marcos.antonio.developer@gmail.com"
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
								<a
									href="https://github.com/MarcosAntonio15243"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Link to github profile"
								>
									<FiGithub className="text-xl hover:text-[var(--color-dark-blue)]" />
								</a>
								<a
									href="https://www.linkedin.com/in/marcos-antonio-18059b234"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Link to linkedin profile"
								>
									<CiLinkedin className="text-2xl hover:text-[var(--color-dark-blue)]" />
								</a>
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
