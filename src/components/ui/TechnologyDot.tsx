import { TECHNOLOGY_FALLBACK_COLOR } from "@/lib/projects/helpers";

export function TechnologyDot({ color }: { color: string | null }) {
	return (
		<span
			aria-hidden="true"
			className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
			style={{ backgroundColor: color || TECHNOLOGY_FALLBACK_COLOR }}
		/>
	);
}
