import { defineField, defineType } from "sanity";

export const technology = defineType({
	name: "technology",
	title: "Technology",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "color",
			type: "color",
			options: { disableAlpha: true },
			description: "Color of the dot shown next to the name. Gray if empty.",
		}),
	],
	orderings: [
		{
			title: "Name",
			name: "nameAsc",
			by: [{ field: "name", direction: "asc" }],
		},
	],
	preview: {
		select: { title: "name", color: "color.hex" },
		prepare: ({ title, color }) => ({
			title,
			subtitle: color ?? "no color",
		}),
	},
});
