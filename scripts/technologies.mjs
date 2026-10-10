// Known colors for the first import; anything else gets no color (gray) and
// can be painted later in the Studio
const COLORS = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	"React.Js": "#61dafb",
	NestJs: "#e0234e",
	"Drizzle ORM": "#c5f74f",
	PostgreSQL: "#336791",
	Docker: "#2496ed",
	"TanStack Query": "#ff4154",
	Zod: "#3068b7",
};

export function technologyId(name) {
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return `technology-${slug}`;
}

export function technologyDoc(name) {
	const hex = COLORS[name];
	return {
		_id: technologyId(name),
		_type: "technology",
		name,
		...(hex ? { color: { _type: "color", hex, alpha: 1 } } : {}),
	};
}
