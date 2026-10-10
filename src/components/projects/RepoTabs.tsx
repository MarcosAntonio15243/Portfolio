import Link from "next/link";

interface RepoTabsProps {
	slug: string;
	tabs: { id: string; label: string }[];
	active: string;
}

export function RepoTabs({ slug, tabs, active }: RepoTabsProps) {
	if (tabs.length < 2) return null;

	return (
		<nav
			aria-label="Project repositories"
			className="flex flex-wrap gap-2 border-b-[1px] border-[var(--color-border)]"
		>
			{tabs.map((tab) => {
				const isActive = tab.id === active;
				return (
					<Link
						key={tab.id}
						href={`/projects/${slug}?repo=${tab.id}`}
						scroll={false}
						aria-current={isActive ? "page" : undefined}
						className={`px-4 py-2 text-sm font-roboto border-b-2 -mb-[1px] transition-colors ${
							isActive
								? "border-[var(--color-primary)] text-[var(--color-primary)] font-medium"
								: "border-transparent text-[var(--color-gray-400)] hover:text-[var(--color-text-primary)]"
						}`}
					>
						{tab.label}
					</Link>
				);
			})}
		</nav>
	);
}
