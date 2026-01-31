import ChatBubble from "./chat-bubble";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import { IMessage } from "@/store/chat-store";
import { useEffect, useLayoutEffect, useRef } from "react";

const MessageContainer = () => {
	const { selectedConversation } = useConversationStore();

	const messages = useQuery(api.messages.getMessages, {
		conversation: selectedConversation!._id,
	});

	const me = useQuery(api.users.getMe);

	const containerRef = useRef<HTMLDivElement>(null);
	const didInitialScroll = useRef(false);

	const scrollToBottom = () => {
		if (!containerRef.current) return;
		containerRef.current.scrollTop =
			containerRef.current.scrollHeight;
	};

	/* 1️⃣ scroll immediately on open */
	useLayoutEffect(() => {
		if (!messages?.length) return;

		scrollToBottom();
		didInitialScroll.current = true;
	}, [messages, selectedConversation?._id]);

	/* 2️⃣ if LAST message is media, scroll again when it loads */
	useEffect(() => {
		if (!messages?.length) return;
		if (!didInitialScroll.current) return;

		const last = messages[messages.length - 1];

		if (last.messageType !== "image" && last.messageType !== "video")
			return;

		const media = containerRef.current?.querySelector(
			"img:last-of-type, video:last-of-type"
		);

		if (!media) return;

		const onLoad = () => scrollToBottom();

		media.addEventListener("load", onLoad);
		media.addEventListener("loadedmetadata", onLoad);

		return () => {
			media.removeEventListener("load", onLoad);
			media.removeEventListener("loadedmetadata", onLoad);
		};
	}, [messages]);

	/* collect all images */
	const allImages: string[] =
		messages
			?.filter((m: IMessage) => m.messageType === "image")
			.map((m: IMessage) => m.content) || [];

	return (
  <div
    ref={containerRef}
    className="
      relative flex-1 overflow-y-auto overflow-x-hidden overscroll-contain
      bg-(image:--bg-chat-tile-light)
      dark:bg-(image:--bg-chat-tile-dark)
      bg-repeat
      bg-size-[420px_420px]
      bg-position-[0_0]
      min-h-full
      before:absolute before:inset-0 before:pointer-events-none
      before:bg-gradient-to-b
      before:from-transparent
      before:via-transparent
      before:to-background/25
    "
  >
    <div className="px-3 md:px-12 pt-8 flex flex-col gap-3">
      {messages?.map((msg, idx) => (
        <ChatBubble
          key={msg._id}
          me={me}
          message={msg}
          previousMessage={idx > 0 ? messages[idx - 1] : undefined}
          allImages={allImages}
        />
      ))}

      <div className="h-[120px] md:h-6" />
    </div>
  </div>
);

};

export default MessageContainer;
