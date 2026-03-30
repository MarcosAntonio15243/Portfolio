"use client";

import { HeaderButton } from "../buttons";
import { NavBar } from "./NavBar";

export function Header() {
	return (
		<header className="fixed w-full z-1000 py-3 border-b-[1px] flex justify-center">
			<div className="flex flex-row justify-between items-center w-full max-content-w">
				<a
					href="#home"
					aria-label="Link to Start of Portfólio"
					className="font-dm-serif-display text-2xl leading-0 text-[var(--color-primary)]"
				>
					Marcos
				</a>
				<NavBar className="hidden flex-row sm:flex gap-10" />
				<div className="sm:hidden relative">
					<HeaderButton />
				</div>
			</div>
		</header>
	);
}
