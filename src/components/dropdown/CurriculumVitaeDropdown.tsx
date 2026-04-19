"use client";
import { useState, useRef, useEffect } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { ChevronDown, ExternalLink } from "lucide-react";

const cvLinks = [
	{
		lang: "Português",
		flag: "🇧🇷",
		href: "https://drive.google.com/file/d/161qEL4Legezs2Tm63UkUWrDwbPtFaYv3/view?usp=sharing",
	},
	{
		lang: "English",
		flag: "🇺🇸",
		href: "https://drive.google.com/file/d/1rYJveVt785XJq2k0FWu2vGUDHT8XNxaH/view?usp=sharing",
	},
];

export function CurriculumVitaeDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("click", handler);
		return () => document.removeEventListener("click", handler);
	}, []);

	return (
		<div className="relative" ref={ref}>
			<button
				onClick={() => setOpen((v) => !v)}
				className="font-roboto cursor-pointer hover:underline flex items-center gap-1 flex-row"
				aria-haspopup="true"
				aria-expanded={open}
			>
				<span className="capitalize font-medium">Curriculum Vitae</span>
				<IoDocumentTextOutline size={15} />
				<ChevronDown
					className={`size-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className="absolute right-0 top-[calc(100%+8px)] z-10 min-w-44 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
					{cvLinks.map((item) => (
						<a
							key={item.lang}
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-bg-image)] border-b border-[var(--color-border)] last:border-b-0"
							onClick={() => setOpen(false)}
						>
							<span className="text-base">{item.flag}</span>
							<span className="flex flex-col">
								<span className="font-medium">{item.lang}</span>
							</span>
							<ExternalLink className="ml-auto size-3 text-[var(--color-gray-400)]" />
						</a>
					))}
				</div>
			)}
		</div>
	);
}
