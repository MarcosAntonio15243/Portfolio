"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageModal } from "../cards/ImageModal";

interface ImageModalTriggerProps {
	src: string;
	index: number;
}

export function ImageModalTrigger({ src, index }: ImageModalTriggerProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				aria-label={`Ampliar screenshot ${index + 1}`}
				className="group relative aspect-video overflow-hidden border-[1px] border-[var(--color-bg-image)] cursor-zoom-in w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-dark-blue)]"
			>
				<Image
					src={src}
					alt={`Screenshot ${index + 1}`}
					fill
					sizes="(max-width: 640px) 100vw, 50vw"
					className="object-cover object-top transition-opacity group-hover:opacity-80"
					quality={85}
				/>
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
					<span className="bg-white/90 text-black text-xs font-medium px-3 py-1.5 rounded-full">
						🔍 Ampliar
					</span>
				</div>
			</button>

			<ImageModal
				src={src}
				alt={`Screenshot ${index + 1}`}
				isOpen={open}
				onClose={() => setOpen(false)}
			/>
		</>
	);
}
