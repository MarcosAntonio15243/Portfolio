import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
	name: "siteSettings",
	title: "Site settings",
	type: "document",
	fields: [
		defineField({ name: "profileImage", type: "image" }),
		defineField({ name: "headline", type: "string" }),
		defineField({ name: "subheadline", type: "string" }),
		defineField({ name: "intro", type: "text", rows: 3 }),
		defineField({ name: "location", type: "string" }),
		defineField({ name: "email", type: "string" }),
		defineField({ name: "githubUrl", type: "url" }),
		defineField({ name: "linkedinUrl", type: "url" }),
		defineField({
			name: "cvLinks",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({ name: "lang", type: "string" }),
						defineField({ name: "flag", type: "string" }),
						defineField({ name: "href", type: "url" }),
					],
					preview: { select: { title: "lang", subtitle: "href" } },
				}),
			],
		}),
		defineField({
			name: "about",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					styles: [{ title: "Normal", value: "normal" }],
					lists: [],
					marks: {
						decorators: [{ title: "Bold", value: "strong" }],
						annotations: [],
					},
				}),
			],
		}),
		defineField({ name: "contactText", type: "text", rows: 2 }),
	],
	preview: { prepare: () => ({ title: "Site settings" }) },
});
