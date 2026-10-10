"use client";

import { colorInput } from "@sanity/color-input";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
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
		colorInput(),
		structureTool({
			structure: (S, context) =>
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
						orderableDocumentListDeskItem({
							type: "project",
							title: "Projects",
							S,
							context,
						}),
						S.documentTypeListItem("experience").title("Experiences"),
						S.documentTypeListItem("technology").title("Technologies"),
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
