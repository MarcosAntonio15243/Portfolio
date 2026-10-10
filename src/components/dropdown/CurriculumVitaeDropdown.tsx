"use client";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";

interface CvLink {
	lang: string;
	flag: string;
	href: string;
}

export function CurriculumVitaeDropdown({ links }: { links: CvLink[] }) {
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

	if (links.length === 0) return null;

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
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
					{links.map((item) => (
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
