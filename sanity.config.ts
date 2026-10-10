"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";

export default defineConfig({
	name: "default",
	title: "Portfolio",
	basePath: "/studio",
	projectId,
	dataset,
	schema: { types: schemaTypes },
	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title("Content")
					.items([
						S.listItem()
							.title("Site settings")
							.id("siteSettings")
							.child(
								S.document()
									.schemaType("siteSettings")
									.documentId("siteSettings"),
							),
						S.divider(),
						S.documentTypeListItem("project").title("Projects"),
						S.documentTypeListItem("experience").title("Experiences"),
					]),
		}),
	],
	document: {
		newDocumentOptions: (prev, { creationContext }) =>
			creationContext.type === "global"
				? prev.filter((t) => t.templateId !== "siteSettings")
				: prev,
	},
});
