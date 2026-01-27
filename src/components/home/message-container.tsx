import ChatBubble from "./chat-bubble";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import { IMessage } from "@/store/chat-store";

const MessageContainer = () => {
	const { selectedConversation } = useConversationStore();

	const messages = useQuery(api.messages.getMessages, {
		conversation: selectedConversation!._id,
	});

	const me = useQuery(api.users.getMe);

	/* ================= ADD THIS ================= */
	const allImages: string[] =
		messages
			?.filter((m: IMessage) => m.messageType === "image")
			.map((m: IMessage) => m.content) || [];
	/* ============================================ */

	return (
		<div
			className="
        relative p-3 flex-1 overflow-auto
        bg-(image:--bg-chat-tile-light)
        dark:bg-(image:--bg-chat-tile-dark)
        bg-repeat
        bg-cover
      "
		>
			<div className="mx-12 flex flex-col gap-3 min-h-full">
				{messages?.map((msg, idx) => (
					<div key={msg._id}>
						<ChatBubble
							me={me}
							message={msg}
							previousMessage={idx > 0 ? messages[idx - 1] : undefined}
							allImages={allImages}  
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default MessageContainer;
