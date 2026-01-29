import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat-store";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MediaDialog from "../home/MediaDialog";
import ChatAvatarActions from "./chat-avatar-actions";


type ChatBubbleProps = {
	message: IMessage;
	me: any;
	previousMessage?: IMessage;
	allImages: string[];
};


/* ================= IMAGE ================= */
const ImageMessage = ({
	message,
	allImages,
}: {
	message: IMessage;
	allImages: string[];
}) => {
	const [open, setOpen] = useState(false);
	const [scale, setScale] = useState(1);
	const currentIndex = allImages.indexOf(message.content);
	const [index, setIndex] = useState(currentIndex);

	const startY = useRef<number | null>(null);
	const startX = useRef<number | null>(null);
	const lastTap = useRef<number>(0);
	const pinchStart = useRef<number | null>(null);

	const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
	const zoomOut = () => setScale((s) => Math.max(s - 0.25, 1));

	const goNext = () => {
		if (index < allImages.length - 1) {
			setIndex(index + 1);
			setScale(1);
		}
	};

	const goPrev = () => {
		if (index > 0) {
			setIndex(index - 1);
			setScale(1);
		}
	};

	/* ESC TO CLOSE */
	useEffect(() => {
		if (!open) return;
		const esc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", esc);
		return () => window.removeEventListener("keydown", esc);
	}, [open]);

	/* TOUCH START */
	const onTouchStart = (e: React.TouchEvent) => {
		if (e.touches.length === 1) {
			startY.current = e.touches[0].clientY;
			startX.current = e.touches[0].clientX;
		}

		if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			pinchStart.current = Math.sqrt(dx * dx + dy * dy);
		}
	};

	/* TOUCH MOVE */
	const onTouchMove = (e: React.TouchEvent) => {
		if (e.touches.length === 2 && pinchStart.current) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			setScale(Math.min(Math.max((dist / pinchStart.current) * scale, 1), 3));
		}
	};

	/* TOUCH END */
	const onTouchEnd = (e: React.TouchEvent) => {
		if (startY.current !== null && startX.current !== null) {
			const endY = e.changedTouches[0].clientY;
			const endX = e.changedTouches[0].clientX;

			/* SWIPE DOWN TO CLOSE */
			if (endY - startY.current > 120) {
				setOpen(false);
			}

			/* SWIPE LEFT / RIGHT */
			const diffX = endX - startX.current;
			if (Math.abs(diffX) > 80) {
				diffX > 0 ? goPrev() : goNext();
			}
		}

		startY.current = null;
		startX.current = null;
		pinchStart.current = null;
	};

	/* DOUBLE TAP */
	const onDoubleTap = () => {
		const now = Date.now();
		if (now - lastTap.current < 300) {
			setScale((s) => (s === 1 ? 2.5 : 1));
		}
		lastTap.current = now;
	};

	return (
		<>
			{/* CHAT IMAGE */}
			<div
				className="relative max-w-55 rounded-xl overflow-hidden cursor-pointer"
				onClick={() => setOpen(true)}
			>
				<Image
					src={message.content}
					width={220}
					height={220}
					className="object-cover rounded-xl"
					alt="chat image"
				/>
			</div>

			{/* DIALOG */}
			{open && (
				<div className="fixed inset-0 z-999">
					{/* BACKDROP */}
					<div
						className="fixed inset-0 bg-black/90"
						onClick={() => setOpen(false)}
					/>

					{/* CONTENT */}
					<div className="fixed inset-0 z-10 flex flex-col pointer-events-none">
						{/* TOP BAR */}
						<div className="flex justify-end gap-4 p-4 text-white pointer-events-auto">
							<button onClick={zoomIn}>＋</button>
							<button onClick={zoomOut}>－</button>

							<a
								href={allImages[index]}
								download
								className="underline"
							>
								Download
							</a>

							<button onClick={() => setOpen(false)}>✕</button>
						</div>

						{/* IMAGE VIEW */}
						<div
							className="flex-1 flex items-center justify-center pointer-events-none relative"
							onTouchStart={onTouchStart}
							onTouchMove={onTouchMove}
							onTouchEnd={onTouchEnd}
							onClick={onDoubleTap}
						>
							{/* PREV */}
							{index > 0 && (
								<button
									onClick={goPrev}
									className="absolute left-4 text-white text-4xl pointer-events-auto"
								>
									‹
								</button>
							)}

							<img
								src={allImages[index]}
								style={{ transform: `scale(${scale})` }}
								className="max-h-[90vh] max-w-[90vw] transition-transform pointer-events-auto"
								alt="preview"
							/>

							{/* NEXT */}
							{index < allImages.length - 1 && (
								<button
									onClick={goNext}
									className="absolute right-4 text-white text-4xl pointer-events-auto"
								>
									›
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};




/* ================= VIDEO ================= */
const VideoMessage = ({ message }: { message: IMessage }) => {
	return (
		<div className="relative max-w-55 rounded-xl overflow-hidden bg-black">
			<video
				src={message.content}
				className="w-55 h-auto rounded-xl"
				controls
			/>

			<div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1">
				<span>
					{new Date(message._creationTime).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
				<MessageSeenSvg />
			</div>
		</div>
	);
};



/* ================= TIME ================= */
const MessageTime = ({
	time,
	fromMe,
}: {
	time: string;
	fromMe: boolean;
}) => {
	return (
		<p
			className="text-[10px] mt-2 self-end flex gap-1 items-center"
			suppressHydrationWarning
		>
			{time} {fromMe && <MessageSeenSvg />}
		</p>
	);
};

const OtherMessageIndicator = () => (
	<div className="absolute bg-white dark:bg-gray-primary top-0 -left-1 w-3 h-3 rounded-bl-full" />
);

const SelfMessageIndicator = () => (
	<div className="absolute bg-green-chat top-0 -right-0.75 w-3 h-3 rounded-br-full overflow-hidden" />
);

/* ================= TEXT ================= */
const TextMessage = ({ message }: { message: IMessage }) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content);

	return (
		<div>
			{isLink ? (
				<a
					href={message.content}
					target="_blank"
					rel="noopener noreferrer"
					className="mr-2 text-sm font-light text-blue-400 underline"
				>
					{message.content}
				</a>
			) : (
				<p className="mr-2 text-sm font-light">{message.content}</p>
			)}
		</div>
	);
};







const ChatBubble = ({ me, message, previousMessage,allImages }: ChatBubbleProps) => {
	
	const date = new Date(message._creationTime);
	let hour = date.getHours();
	const minute = date.getMinutes().toString().padStart(2, "0");
	const ampm = hour >= 12 ? "PM" : "AM";
	hour = hour % 12;
	hour = hour === 0 ? 12 : hour;
	const time = `${hour}:${minute} ${ampm}`;

	const { selectedConversation } = useConversationStore();
	const isMember =
		selectedConversation?.participants.includes(message.sender._id) || false;
	const isGroup = selectedConversation?.isGroup;
	const fromMe = message.sender._id === me?._id;
	const bgClass = fromMe
		? "bg-green-chat"
		: "bg-white dark:bg-gray-primary";

	const [open,setOpen] = useState(false);
	const [Uploadingbar, setUploadingbar] = useState(false);


	/* ================= OTHER USER ================= */
	if (!fromMe) {
		return (
			<>
				<DateIndicator message={message} previousMessage={previousMessage} />
				<div className="flex gap-1 w-2/3 mr-auto">
					<ChatBubbleAvatar
						isGroup={isGroup}
						isMember={isMember}
						message={message}
						fromAI={false}
					/>

					{message.messageType === "image" ? (
  <div className="mr-auto">
    <ImageMessage message={message} allImages={allImages} />
  </div>
) : message.messageType === "video" ? (
  <div className="mr-auto">
    <VideoMessage message={message} />
  </div>
) : (

				<div
					className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
							<OtherMessageIndicator />
							{isGroup && <ChatAvatarActions
							 message={message}
							 me={me}
							/> }
							<TextMessage message={message} />
							<MessageTime time={time} fromMe={fromMe} />
						</div>
					)}
				</div>
			</>
		);
	}

	/* ================= FROM ME ================= */
useEffect(() => {
	if (message.messageType === "image" || message.messageType === "video") {
		setUploadingbar(true);
		const t = setTimeout(() => setUploadingbar(false), 1200);
		return () => clearTimeout(t);
	}
}, [message._id]);

return (
	<>
		<DateIndicator message={message} previousMessage={previousMessage} />

		<div className="flex gap-1 w-2/3 ml-auto">
			{Uploadingbar ? (
				/* FAKE UPLOADING ILLUSION */
				<div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white shadow-md animate-pulse ml-auto">
					<span className="text-sm font-medium">loading</span>
					<span className="dot-typing" />
				</div>
			) : message.messageType === "image" ? (
				<div className="ml-auto">
					<ImageMessage message={message} allImages={allImages} />
				</div>
			) : message.messageType === "video" ? (
				<div className="ml-auto">
					<VideoMessage message={message} />
				</div>
			) : (
				<div
					className={`flex z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}
				>
					<SelfMessageIndicator />
					<TextMessage message={message} />
					<MessageTime time={time} fromMe={fromMe} />
				</div>
			)}
		</div>
	</>
);

}

export default ChatBubble;