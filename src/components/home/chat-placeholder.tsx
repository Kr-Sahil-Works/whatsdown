import { Lock } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const ChatPlaceHolder = () => {
	return (
		<div
			className='flex w-full md:w-3/4 relative items-center justify-center overflow-hidden
			bg-linear-to-br from-gray-100 via-green-100/70 to-gray-200
			dark:from-neutral-900 dark:via-green-900/40 dark:to-neutral-800'
		>
			{/* Subtle green glow */}
			<div className='absolute -top-32 -right-32 w-72 h-72 md:w-96 md:h-96 bg-green-400/20 rounded-full blur-3xl' />
			<div className='absolute -bottom-32 -left-32 w-72 h-72 md:w-96 md:h-96 bg-green-500/15 rounded-full blur-3xl' />

			{/* Glass card */}
			<div
				className='relative z-10 max-w-md md:max-w-xl w-full mx-4 md:mx-6 rounded-2xl
				border border-white/40 dark:border-white/10
				bg-white/70 dark:bg-white/5 backdrop-blur-xl
				shadow-xl px-6 md:px-8 py-8 md:py-10 text-center'
			>
				<Image
					src='/desktop-hh.png'
					alt='Hero'
					width={320}
					height={188}
					className='mx-auto mb-5 w-full max-w-55 md:max-w-70'
					priority
				/>

				<h2 className='text-xl md:text-3xl font-light text-gray-900 dark:text-gray-100'>
				 WhatsApp for geeks with openai features
				</h2>

				<p className='mt-2 md:mt-3 text-xs md:text-base text-gray-600 dark:text-gray-400'>
					Make calls, share your screen, and enjoy a faster desktop experience.
				</p>

				<Button className='mt-4 md:mt-6 rounded-full px-5 md:px-6 bg-green-primary hover:bg-green-secondary shadow-sm'>
					Get from Microsoft Store
				</Button>
			</div>

			{/* Footer */}
			<p className='absolute bottom-3 md:bottom-6 text-[10px] md:text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 px-2 text-center'>
				<Lock size={10} />
				Your personal messages are end-to-end encrypted
			</p>
		</div>
	);
};

export default ChatPlaceHolder;
