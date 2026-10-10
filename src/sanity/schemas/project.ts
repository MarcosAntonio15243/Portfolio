import { defineArrayMember, defineField, defineType } from "sanity";
import { normalizeRepo } from "@/lib/projects";

export const project = defineType({
	name: "project",
	title: "Project",
	type: "document",
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: { source: "title", maxLength: 80 },
			validation: (r) => r.required(),
		}),
		defineField({
			name: "summary",
			type: "text",
			rows: 3,
			description:
				"Short description for cards and the page header. If empty, the GitHub description is used.",
		}),
		defineField({
			name: "technologies",
			type: "array",
			of: [{ type: "string" }],
			options: { layout: "tags" },
		}),
		defineField({
			name: "cover",
			type: "image",
			options: { hotspot: true },
			description: "Optional. If empty, the GitHub Open Graph image is used.",
		}),
		defineField({ name: "featured", type: "boolean", initialValue: false }),
		defineField({
			name: "order",
			type: "number",
			description: "Lower numbers come first.",
		}),
		defineField({
			name: "repositories",
			type: "array",
			description:
				"The first repository is the main one. Array order is the tab order.",
			validation: (r) => r.required().min(1),
			of: [
				defineArrayMember({
					type: "object",
					name: "repositoryRef",
					fields: [
						defineField({
							name: "label",
							type: "string",
							description: 'For example "Front-end" or "Back-end".',
							validation: (r) => r.required(),
						}),
						defineField({
							name: "repo",
							type: "string",
							description: "owner/name or a GitHub URL.",
							validation: (r) =>
								r
									.required()
									.custom((value) =>
										typeof value === "string" && normalizeRepo(value)
											? true
											: "Use owner/name or a github.com URL",
									),
						}),
					],
					preview: { select: { title: "label", subtitle: "repo" } },
				}),
			],
		}),
	],
	preview: { select: { title: "title", subtitle: "summary", media: "cover" } },
});
