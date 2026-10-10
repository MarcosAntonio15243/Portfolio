import { createReadStream } from "node:fs";
import { createClient } from "@sanity/client";
import { technologyDoc, technologyId } from "./technologies.mjs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
	console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN");
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: "2025-01-01",
	useCdn: false,
});

let keyCounter = 0;
const key = () => `k${keyCounter++}`;

// "plain **bold** plain" -> portable text block
function block(text) {
	const children = text
		.split(/(\*\*[^*]+\*\*)/)
		.filter(Boolean)
		.map((part) =>
			part.startsWith("**")
				? {
						_type: "span",
						_key: key(),
						text: part.slice(2, -2),
						marks: ["strong"],
					}
				: { _type: "span", _key: key(), text: part, marks: [] },
		);
	return {
		_type: "block",
		_key: key(),
		style: "normal",
		markDefs: [],
		children,
	};
}

async function upload(path) {
	const asset = await client.assets.upload("image", createReadStream(path));
	return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const about = [
	"I started my journey in development in 2019 when I joined the technical course in Informatics at IFPB – Santa Luzia (PB). That’s where I had my first contact with web development, working with **HTML5**, **CSS3**, and **JavaScript**. Since then, I’ve been continuously building my skills, with a strong focus on modern frameworks, especially **React.js**, which has been my main development tool ever since.",
	"Over the years, I’ve deepened my knowledge of the React ecosystem, working with technologies like **TypeScript**, **Styled Components**, **Axios**, and **Next.js**, as well as databases like **PostgreSQL**. I also gained experience testing APIs with **Postman** and exploring **Oracle APEX**, which helped me broaden my understanding of web development and system integration.",
	"I'm passionate about **learning**, delivering **clean and efficient code**, and creating great **user experiences**. I believe my hands-on **experience**, **adaptability**, and **results-driven mindset** can bring value to any team — especially when it comes to building **responsive interfaces** and integrating systems seamlessly.",
	"I'm excited to take on new challenges, collaborate with passionate teams, and keep growing both personally and professionally.",
].map(block);

const experiences = [
	{
		jobTitle: "Back-End Developer",
		enterprise: "Creatorsfy Enterprise",
		dateStart: "2025-08-01",
		dateEnd: null,
		description:
			"I work as a Back-End Developer focused on building and maintaining services using NestJS, Drizzle ORM, and PostgreSQL. I develop APIs, handle data processing, and work with event-driven communication using Kafka. My role also involves integrating external systems, improving application reliability, and helping the team deliver clean and efficient backend solutions.",
	},
	{
		jobTitle: "Front-End Developer and Scrum Master",
		enterprise: "CODEX Junior Enterprise (Campina Grande, Paraíba, Brazil)",
		dateStart: "2022-11-01",
		dateEnd: "2023-07-01",
		description:
			"I developed web applications with React.js, TypeScript, Axios, HTML5, and CSS3, building reusable components and implementing state management solutions. As Scrum Master, I led agile ceremonies and helped improve team workflows, while also participating in code reviews and technical planning.",
	},
	{
		jobTitle: "Front-End Developer",
		enterprise: "Municipal Government of Junco do Seridó (Paraíba, Brazil)",
		dateStart: "2021-08-01",
		dateEnd: "2021-10-01",
		description:
			"I developed a responsive institutional website using HTML5, CSS3, and JavaScript. I worked on designing and structuring web pages to ensure a clean, user-friendly experience across different devices. In addition, I collaborated with the internal team to gather requirements and transform them into functional solutions.",
	},
];

const projects = [
	{
		slug: "management-platform-for-networking-groups",
		title: "Management Platform for Networking Groups",
		summary:
			"A web platform for managing networking groups, with tools to organize members, membership requests, and invitations. Built with a NestJS (Node.js) API and a Next.js (React) web app.",
		technologies: [
			"NextJs",
			"NestJs",
			"Drizzle ORM",
			"PostgreSQL",
			"Docker",
			"TanStack Query",
			"Shadcn UI",
			"Zod",
		],
		cover: "public/assets/project-1.webp",
		repo: "MarcosAntonio15243/management-platform-for-networking-groups",
	},
	{
		slug: "let-me-ask",
		title: "Let Me Ask",
		summary:
			"A full-stack web app developed during NLW Agents by Rocketseat at 2025 for live streams and broadcasts, which uses an AI agent to predict answers to questions in real time.",
		technologies: [
			"React.Js",
			"NextJs",
			"TypeScript",
			"Drizzle ORM",
			"PostgreSQL",
			"Docker",
			"Zod",
		],
		cover: "public/assets/project-2.webp",
		repo: "MarcosAntonio15243/let-me-ask-web",
	},
];

const tx = client.transaction();

for (const name of new Set(projects.flatMap((p) => p.technologies))) {
	tx.createOrReplace(technologyDoc(name));
}

tx.createOrReplace({
	_id: "siteSettings",
	_type: "siteSettings",
	profileImage: await upload("public/assets/profile.svg"),
	headline: "Hello, I am Marcos",
	subheadline: "A Full-Stack Developer",
	intro:
		"Building complete solutions, combining the development of modern, functional interfaces with the implementation of robust back-end architectures",
	location: "Campina Grande, Paraiba, Brazil",
	email: "marcos.antonio.developer@gmail.com",
	githubUrl: "https://github.com/MarcosAntonio15243",
	linkedinUrl: "https://www.linkedin.com/in/marcos-antonio-18059b234",
	cvLinks: [
		{
			_key: key(),
			lang: "Português",
			flag: "🇧🇷",
			href: "https://drive.google.com/file/d/161qEL4Legezs2Tm63UkUWrDwbPtFaYv3/view?usp=sharing",
		},
		{
			_key: key(),
			lang: "English",
			flag: "🇺🇸",
			href: "https://drive.google.com/file/d/1rYJveVt785XJq2k0FWu2vGUDHT8XNxaH/view?usp=sharing",
		},
	],
	about,
	contactText:
		"Have an opportunity or a project in mind? feel free to get in touch.",
});

for (const [i, e] of experiences.entries()) {
	tx.createOrReplace({ _id: `experience-${i + 1}`, _type: "experience", ...e });
}

for (const p of projects) {
	tx.createOrReplace({
		_id: `project-${p.slug}`,
		_type: "project",
		title: p.title,
		slug: { _type: "slug", current: p.slug },
		summary: p.summary,
		technologies: p.technologies.map((name) => ({
			_type: "reference",
			_key: key(),
			_ref: technologyId(name),
		})),
		cover: await upload(p.cover),
		featured: true,
		repositories: [{ _key: key(), label: "Repository", repo: p.repo }],
	});
}

await tx.commit();
console.log("Seed complete");
