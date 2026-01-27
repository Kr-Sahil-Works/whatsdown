import { useEffect, useRef, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ImageIcon, Plus, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import ReactPlayer from "react-player";


import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";

const MediaDropdown = () => {
	const imageInput = useRef<HTMLInputElement>(null);
	const videoInput = useRef<HTMLInputElement>(null);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

	const [isLoading, setIsLoading] = useState(false);

	const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
	const sendImage = useMutation(api.messages.sendImage);
	const sendVideo = useMutation(api.messages.sendVideo);
	const me = useQuery(api.users.getMe);

	const { selectedConversation } = useConversationStore();

	const handleSendImage = async () => {
		setIsLoading(true);
		try {
			// Step 1: Get a short-lived upload URL
			const postUrl = await generateUploadUrl();
			// Step 2: POST the file to the URL
			const result = await fetch(postUrl, {
				method: "POST",
				headers: { "Content-Type": selectedImage!.type },
				body: selectedImage,
			});

			const { storageId } = await result.json();
			// Step 3: Save the newly allocated storage id to the database
			await sendImage({
				conversation: selectedConversation!._id,
				imgId: storageId,
				sender: me!._id,
			});

			setSelectedImage(null);
		} catch (err) {
			toast.error("Failed to send image");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSendVideo = async () => {
		setIsLoading(true);
		try {
			const postUrl = await generateUploadUrl();
			const result = await fetch(postUrl, {
				method: "POST",
				headers: { "Content-Type": selectedVideo!.type },
				body: selectedVideo,
			});

			const { storageId } = await result.json();

			await sendVideo({
				videoId: storageId,
				conversation: selectedConversation!._id,
				sender: me!._id,
			});

			setSelectedVideo(null);
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<input
				type='file'
				ref={imageInput}
				accept='image/*'
				onChange={(e) => setSelectedImage(e.target.files![0])}
				hidden
			/>

			<input
				type='file'
				ref={videoInput}
				accept='video/mp4'
				onChange={(e) => setSelectedVideo(e.target?.files![0])}
				hidden
			/>

			{selectedImage && (
				<MediaImageDialog
					isOpen={selectedImage !== null}
					onClose={() => setSelectedImage(null)}
					selectedImage={selectedImage}
					isLoading={isLoading}
					handleSendImage={handleSendImage}
				/>
			)}

			{selectedVideo && (
				<MediaVideoDialog
					isOpen={selectedVideo !== null}
					onClose={() => setSelectedVideo(null)}
					selectedVideo={selectedVideo}
					isLoading={isLoading}
					handleSendVideo={handleSendVideo}
				/>
			)}

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
	<span>
		<Plus className='text-gray-600 dark:text-gray-400' />
	</span>
</DropdownMenuTrigger>


			<DropdownMenuContent
	className="
		backdrop-blur-xl
		bg-white/80 dark:bg-gray-900/90
		border border-white/30 dark:border-white/10
		shadow-lg
		rounded-xl
	"
>
					<DropdownMenuItem onClick={() => imageInput.current!.click()}>
						<ImageIcon size={18} className='mr-1' /> Photo
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => videoInput.current!.click()}>
						<Video size={20} className='mr-1' />
						Video
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
export default MediaDropdown;

type MediaImageDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedImage: File;
	isLoading: boolean;
	handleSendImage: () => void;
};

const MediaImageDialog = ({ isOpen, onClose, selectedImage, isLoading, handleSendImage }: MediaImageDialogProps) => {
	const [renderedImage, setRenderedImage] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (!selectedImage) return;
		const reader = new FileReader();
		reader.onload = (e) => setRenderedImage(e.target?.result as string);
		reader.readAsDataURL(selectedImage);
	}, [selectedImage]);

	useEffect(() => {
	if (!isLoading) {
		setProgress(0);
		return;
	}

	let value = 0;
	const interval = setInterval(() => {
		value += Math.random() * 10 + 5;
		if (value >= 90) {
			value = 90;
			clearInterval(interval);
		}
		setProgress(value);
	}, 150);

	return () => clearInterval(interval);
}, [isLoading]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
			if (!isOpen && !isLoading) {
			onClose();
		}}}
		>
		<DialogContent
	className="
		bg-white/95 dark:bg-gray-900/95
		backdrop-blur-xl
		border border-gray-200 dark:border-gray-800
		shadow-xl
	"
	onInteractOutside={(e) => {
		if (isLoading) e.preventDefault();
	}}
	onEscapeKeyDown={(e) => {
		if (isLoading) e.preventDefault();
	}}
	onCloseAutoFocus={(e) => {
		if (isLoading) e.preventDefault();
	}}
>

			<DialogTitle>Send Image</DialogTitle>
				<DialogDescription className="flex flex-col gap-4 justify-center items-center">
	{renderedImage && (
		<Image
			src={renderedImage}
			width={300}
			height={300}
			alt="selected image"
		/>
	)}
</DialogDescription>

{/* SEND BUTTON — MUST BE OUTSIDE DialogDescription */}
<div className="relative w-full h-11 rounded-md overflow-hidden bg-green-600 mt-4">
	{isLoading && (
		<div
			className="absolute left-0 top-0 h-full bg-green-900 transition-all duration-150"
			style={{ width: `${progress}%` }}
		/>
	)}

	<button
		onClick={handleSendImage}
		disabled={isLoading}
		className="relative z-10 w-full h-full text-white font-medium"
	>
		{isLoading ? "Uploading…" : "Send"}
	</button>
</div>

			</DialogContent>
		</Dialog>
	);
};

type MediaVideoDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedVideo: File;
	isLoading: boolean;
	handleSendVideo: () => void;
};

const MediaVideoDialog = ({ isOpen, onClose, selectedVideo, isLoading, handleSendVideo }: MediaVideoDialogProps) => {
	const [renderedVideo, setRenderedVideo] = useState<string | null>(null);

useEffect(() => {
	const url = URL.createObjectURL(selectedVideo);
	setRenderedVideo(url);

	return () => URL.revokeObjectURL(url);
}, [selectedVideo]);

	const [progress, setProgress] = useState(0);

	useEffect(() => {
	if (!isLoading) {
		setProgress(0);
		return;
	}

	let value = 0;
	const interval = setInterval(() => {
		value += Math.random() * 10 + 5;
		if (value >= 90) {
			value = 90;
			clearInterval(interval);
		}
		setProgress(value);
	}, 150);

	return () => clearInterval(interval);
}, [isLoading]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
		<DialogContent
	className="
		bg-white/95 dark:bg-gray-900/95
		backdrop-blur-xl
		border border-gray-200 dark:border-gray-800
		shadow-xl
	"
	onInteractOutside={(e) => {
		if (isLoading) e.preventDefault();
	}}
	onEscapeKeyDown={(e) => {
		if (isLoading) e.preventDefault();
	}}
	onCloseAutoFocus={(e) => {
		if (isLoading) e.preventDefault();
	}}
>
	<DialogTitle>Send Video</DialogTitle>

	{/* DialogDescription MUST contain only text */}
	<DialogDescription>
		Video
	</DialogDescription>

	{/* VIDEO PREVIEW — OUTSIDE DialogDescription */}
	<div className="w-full mt-4">
		{renderedVideo && (
			<video
				playsInline
				src={renderedVideo}
				controls
				className="w-full rounded-md"
				preload="metadata"
			/>
		)}
	</div>

	{/* SEND BUTTON — OUTSIDE DialogDescription */}
	<div className="relative w-full h-11 rounded-md overflow-hidden bg-green-600 mt-6">
		{isLoading && (
			<div
				className="absolute left-0 top-0 h-full bg-green-900 transition-all duration-150"
				style={{ width: `${progress}%` }}
			/>
		)}

		<button
			onClick={handleSendVideo}
			disabled={isLoading}
			className="relative z-10 w-full h-full text-white font-medium"
		>
			{isLoading ? "Uploading…" : "Send"}
		</button>
	</div>
</DialogContent>

		</Dialog>
	);
};