import type { HTMLAttributes } from "react";
import { ThemeSwitch } from "../buttons";

interface NavBarProps extends HTMLAttributes<HTMLElement> {
	className?: string;
}

export function NavBar({ className = "", ...props }: NavBarProps) {
	const navItems = [
		{
			value: "About",
			link: "/#about",
		},
		{
			value: "Experience",
			link: "/#experience",
		},
		{
			value: "Projects",
			link: "/#projects",
		},
		{
			value: "Contact",
			link: "/#contact",
		},
	];

	return (
		<nav className={`font-roboto font-light flex ${className}`} {...props}>
			{navItems.map((e) => {
				return (
					<a
						key={e.value}
						href={e.link}
						className="text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] hover:underline outline-none"
					>
						{e.value}
					</a>
				);
			})}
			<ThemeSwitch />
		</nav>
	);
}
