import { useEffect, useRef, useState } from "react";

type MediaItem = {
	type: "image" | "video";
	src: string;
};

type MediaDialogProps = {
	open: boolean;
	onClose: () => void;
	items: MediaItem[];
	startIndex: number;
};

const MediaDialog = ({ open, onClose, items, startIndex }: MediaDialogProps) => {
	const [index, setIndex] = useState(startIndex);
	const [scale, setScale] = useState(1);
	const startY = useRef<number | null>(null);
	const lastTap = useRef<number>(0);
	const distance = useRef<number | null>(null);

	const item = items[index];

	/* ESC TO CLOSE */
	useEffect(() => {
		const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", esc);
		return () => window.removeEventListener("keydown", esc);
	}, [onClose]);

	/* RESET ZOOM ON CHANGE */
	useEffect(() => {
		setScale(1);
	}, [index]);

	/* SWIPE DOWN TO CLOSE */
	const onTouchStart = (e: React.TouchEvent) => {
		startY.current = e.touches[0].clientY;

		if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			distance.current = Math.sqrt(dx * dx + dy * dy);
		}
	};

	const onTouchMove = (e: React.TouchEvent) => {
		if (e.touches.length === 2 && distance.current) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const newDist = Math.sqrt(dx * dx + dy * dy);
			setScale((newDist / distance.current) * scale);
		}
	};

	const onTouchEnd = (e: React.TouchEvent) => {
		if (!startY.current) return;
		const endY = e.changedTouches[0].clientY;
		if (endY - startY.current > 120) onClose();
		startY.current = null;
		distance.current = null;
	};

	/* DOUBLE TAP ZOOM */
	const onDoubleTap = () => {
		const now = Date.now();
		if (now - lastTap.current < 300) {
			setScale((s) => (s === 1 ? 2.5 : 1));
		}
		lastTap.current = now;
	};

	return (
		open && (
			<div className="fixed inset-0 z-999">
				{/* BACKDROP */}
				<div className="absolute inset-0 bg-black/95" onClick={onClose} />

				{/* CONTENT */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					{/* PREV */}
					{index > 0 && (
						<button
							onClick={() => setIndex(index - 1)}
							className="absolute left-4 text-white text-3xl pointer-events-auto"
						>
							‹
						</button>
					)}

					{/* NEXT */}
					{index < items.length - 1 && (
						<button
							onClick={() => setIndex(index + 1)}
							className="absolute right-4 text-white text-3xl pointer-events-auto"
						>
							›
						</button>
					)}

					{/* MEDIA */}
					<div
						className="pointer-events-auto"
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}
						onClick={onDoubleTap}
					>
						{item.type === "image" ? (
							<img
								src={item.src}
								style={{ transform: `scale(${scale})` }}
								className="max-h-[90vh] max-w-[90vw] transition-transform"
								alt=""
							/>
						) : (
							<video
								src={item.src}
								controls
								className="max-h-[90vh] max-w-[90vw] rounded-xl"
							/>
						)}
					</div>
				</div>

				{/* TOP BAR */}
				<div className="absolute top-4 right-4 text-white flex gap-4 pointer-events-auto">
					<a href={item.src} download>
						Download
					</a>
					<button onClick={onClose}>✕</button>
				</div>
			</div>
		)
	);
};

export default MediaDialog;