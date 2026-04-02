"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import { ThemeSwitch } from "../buttons";

interface NavBarProps extends HTMLAttributes<HTMLElement> {
	className?: string;
}

const navItems = [
	{ value: "About", link: "/#about" },
	{ value: "Experience", link: "/#experience" },
	{ value: "Projects", link: "/#projects" },
	{ value: "Contact", link: "/#contact" },
];

export function NavBar({ className = "", ...props }: NavBarProps) {
	const pathname = usePathname();

	const baseCls = "outline-none transition-colors";
	const activeCls = "text-[var(--color-primary)] font-medium";
	const inactiveCls =
		"text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] hover:underline";

	const isActive = (link: string, value: string) => {
		if (!link.startsWith("/#")) return false;
		return pathname.startsWith(`/${value.toLowerCase()}`);
	};

	const getHref = (link: string, value: string) => {
		if (isActive(link, value)) return `/${value.toLowerCase()}`;
		return link;
	};

	return (
		<nav className={`font-roboto font-light flex ${className}`} {...props}>
			{navItems.map((e) => (
				<Link
					key={e.value}
					href={getHref(e.link, e.value)}
					className={`${baseCls} ${isActive(e.link, e.value) ? activeCls : inactiveCls}`}
				>
					{e.value}
				</Link>
			))}
			<ThemeSwitch />
		</nav>
	);
}
