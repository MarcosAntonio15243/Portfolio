"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageModalProps {
	src: string;
	alt?: string;
	isOpen: boolean;
	onClose: () => void;
}

export function ImageModal({
	src,
	alt = "Project preview",
	isOpen,
	onClose,
}: ImageModalProps) {
	const [scale, setScale] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });
	const MIN_SCALE = 1;
	const MAX_SCALE = 4;

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	// Reset zoom and position when modal is closed
	useEffect(() => {
		if (!isOpen) {
			setScale(1);
			setPosition({ x: 0, y: 0 });
		}
	}, [isOpen]);

	const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, MAX_SCALE));

	const handleZoomOut = () => {
		setScale((s) => {
			const next = Math.max(s - 0.5, MIN_SCALE);
			if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
			return next;
		});
	};

	const handleReset = () => {
		setScale(1);
		setPosition({ x: 0, y: 0 });
	};

	// Wheel zoom
	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const delta = e.deltaY < 0 ? 0.3 : -0.3;
		setScale((s) => {
			const next = Math.min(Math.max(s + delta, MIN_SCALE), MAX_SCALE);
			if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
			return next;
		});
	};

	// Drag
	const handleMouseDown = (e: React.MouseEvent) => {
		if (scale <= 1) return;
		setIsDragging(true);
		dragStart.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		};
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		setPosition({
			x: e.clientX - dragStart.current.x,
			y: e.clientY - dragStart.current.y,
		});
	};

	const handleMouseUp = () => setIsDragging(false);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-1000 flex items-center justify-center bg-black/80 backdrop-blur-sm"
			onClick={onClose}
		>
			{/* Toolbar */}
			<div
				className="absolute top-4 right-4 flex items-center gap-2 z-10"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={handleZoomOut}
					disabled={scale <= MIN_SCALE}
					aria-label="Zoom out"
					className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-colors"
				>
					<ZoomOut className="size-5" />
				</button>
				<span className="text-white text-sm font-mono min-w-[3rem] text-center">
					{Math.round(scale * 100)}%
				</span>
				<button
					onClick={handleZoomIn}
					disabled={scale >= MAX_SCALE}
					aria-label="Zoom in"
					className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-colors"
				>
					<ZoomIn className="size-5" />
				</button>
				<button
					onClick={handleReset}
					aria-label="Reset zoom"
					className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
				>
					<RotateCcw className="size-4" />
				</button>
				<button
					onClick={onClose}
					aria-label="Close modal"
					className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
				>
					<X className="size-5" />
				</button>
			</div>

			{/* Scroll hint */}
			{scale === 1 && (
				<p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs pointer-events-none">
					Scroll or use the buttons to zoom
				</p>
			)}

			{/* Image */}
			<div
				className="relative overflow-hidden"
				style={{ width: "90vw", height: "85vh" }}
				onClick={(e) => e.stopPropagation()}
				onWheel={handleWheel}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				<div
					style={{
						transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
						transition: isDragging ? "none" : "transform 0.2s ease",
						cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
						width: "100%",
						height: "100%",
						position: "relative",
					}}
				>
					<Image
						src={src}
						alt={alt}
						fill
						className="object-contain select-none"
						draggable={false}
						sizes="90vw"
					/>
				</div>
			</div>
		</div>
	);
}
