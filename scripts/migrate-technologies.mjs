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
	perspective: "raw", // includes drafts
});

// Turns the old string list on each project into references to technology docs
const projects = await client.fetch(
	`*[_type == "project" && defined(technologies)]{ _id, technologies }`,
);

let keyCounter = 0;
const tx = client.transaction();
let changed = 0;

for (const project of projects) {
	if (!project.technologies.some((t) => typeof t === "string")) continue;

	const references = project.technologies.map((t) => {
		if (typeof t !== "string") return t; // already a reference
		tx.createIfNotExists(technologyDoc(t));
		return {
			_type: "reference",
			_key: `m${keyCounter++}`,
			_ref: technologyId(t),
		};
	});
	tx.patch(project._id, (p) => p.set({ technologies: references }));
	changed++;
}

if (changed === 0) {
	console.log("Nothing to migrate");
} else {
	await tx.commit();
	console.log(`Migrated ${changed} project(s)`);
}
