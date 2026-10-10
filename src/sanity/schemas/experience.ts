import { defineField, defineType } from "sanity";

export const experience = defineType({
	name: "experience",
	title: "Experience",
	type: "document",
	fields: [
		defineField({
			name: "jobTitle",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "enterprise",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "dateStart",
			type: "date",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "dateEnd",
			type: "date",
			description: "Leave empty for the current job (shown as Present).",
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 5,
			validation: (r) => r.required(),
		}),
	],
	orderings: [
		{
			title: "Start date, newest first",
			name: "dateStartDesc",
			by: [{ field: "dateStart", direction: "desc" }],
		},
	],
	preview: { select: { title: "jobTitle", subtitle: "enterprise" } },
});
