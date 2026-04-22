"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted)
		return <div className="h-6 w-12 rounded-full bg-[var(--color-border)]" />;

	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className={`
        relative cursor-pointer flex items-center rounded-full transition-colors duration-300 p-1
        h-6 w-12
        ${isDark ? "bg-[var(--color-dark-blue)]" : "bg-[var(--color-gray-100)]"}
      `}
			aria-label="Toggle theme"
		>
			<span
				className={`
          flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md
          transform transition-transform duration-300 ease-in-out
          ${isDark ? "translate-x-6" : "translate-x-0"}
        `}
			>
				{isDark ? (
					<Moon className="h-3 w-3 text-gray-500" />
				) : (
					<Sun className="h-3 w-3 text-gray-500" />
				)}
			</span>
		</button>
	);
}
