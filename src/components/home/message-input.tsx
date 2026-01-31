import { Laugh, Mic, Plus, Send, Check } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import toast from "react-hot-toast";
import useComponentVisible from "@/hooks/useComponentVisible";
import EmojiPicker, {Theme} from "emoji-picker-react";
import MediaDropdown from "./media-dropdown";

const IconBtn = ({
	children,
	onClick,
	active = false,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	active?: boolean;
}) => (
	<button
		type="button"
		onClick={onClick}
		className={`
			h-9 w-9 flex items-center justify-center rounded-full
			text-gray-500 dark:text-gray-400
			transition-all duration-200 ease-out
			hover:bg-gray-200/60 dark:hover:bg-gray-700/60
			hover:scale-110 active:scale-95
			${active ? "bg-gray-300/70 dark:bg-gray-700" : ""}
		`}
	>
		{children}
	</button>
);

const FastSpinner = () => (
	<span
		className="
			h-4 w-4 rounded-full
			border-[2.5px] border-gray-400
			border-t-transparent
			animate-[spin_0.25s_linear_infinite]
		"
	/>
);


const MessageInput = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [msgText, setMsgText] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [sentDone, setSentDone] = useState(false);

	const {selectedConversation} = useConversationStore();
	const {ref,isComponentVisible,setIsComponentVisible} =useComponentVisible(false);

	const me = useQuery(api.users.getMe);
	const sendTextMsg = useMutation(api.messages.sendTextMessage);
	
	const handleSentTextMsg = async (e: React.FormEvent) => {
	e.preventDefault();
	if (!msgText.trim() || isSending) return;

	setIsSending(true);
	setSentDone(false);

	try {
		await sendTextMsg({
			content: msgText,
			conversation: selectedConversation!._id,
			sender: me!._id,
		});

		// feels instant
		setMsgText("");
		requestAnimationFrame(() => {
	inputRef.current?.focus();
});


		// spinner → check
		setTimeout(() => {
			setSentDone(true);
			setIsSending(false);
		}, 120);

		// auto reset
		setTimeout(() => setSentDone(false), 420);
	} catch (error: any) {
		setIsSending(false);
		toast.error(error.message);
	}
};



	return (
  <div
    className="
      fixed bottom-0 left-0 right-0 z-50
      bg-gray-primary
      pb-[env(safe-area-inset-bottom)]
    "
  >
    <div className="p-2 flex gap-4 items-center">

			<div className='relative flex gap-2 ml-2'>
	<div ref={ref}>
		{isComponentVisible && (
			<EmojiPicker
				theme={Theme.DARK}
				onEmojiClick={(emojiObject) =>
					setMsgText(prev => prev + emojiObject.emoji)
				}
				style={{
					position: "absolute",
					bottom: "1.8rem",
					left: "0.5rem",
					zIndex: 50,
				}}
			/>
		)}

		<IconBtn
			onClick={() => setIsComponentVisible(prev => !prev)}
			active={isComponentVisible}
		>
			<Laugh className="h-5 w-5" />
		</IconBtn>
	</div>

	<IconBtn>
		<MediaDropdown/>
	</IconBtn>
</div>

			
			<form onSubmit={handleSentTextMsg} className='w-full flex gap-3'>
				<div className='flex-1'>
					<Input
						type='text'
						placeholder='Type a message'
						className='py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent'
						value={msgText}
						onChange={(e) => setMsgText(e.target.value)}
						
					/>
				</div>
				<div className='mr-4 flex items-center gap-3'>
				<Button
	type='submit'
	size='sm'
	disabled={isSending}
	className='
		bg-transparent hover:bg-transparent
		transition-transform duration-150
		hover:scale-110 active:scale-95
		disabled:opacity-70
	'
>
	{isSending ? (
		<FastSpinner />
	) : sentDone ? (
		<Check className="text-green-500 scale-110 animate-[scale_0.2s_ease-out]" />
	) : msgText.length > 0 ? (
		<Send />
	) : (
		<Mic />
	)}
</Button>


				</div>
			</form>
		</div>
		</div>
	);
};
export default MessageInput;