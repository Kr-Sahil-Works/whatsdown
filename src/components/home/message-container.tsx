"use client";

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
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  useLayoutEffect(() => {
    if (!messages?.length) return;
    scrollToBottom();
    didInitialScroll.current = true;
  }, [messages, selectedConversation?._id]);

  useEffect(() => {
    if (!messages?.length || !didInitialScroll.current) return;

    const last = messages[messages.length - 1];
    if (last.messageType !== "image" && last.messageType !== "video") return;

    const media = containerRef.current?.querySelector(
      "img:last-of-type, video:last-of-type"
    );
    if (!media) return;

    media.addEventListener("load", scrollToBottom);
    media.addEventListener("loadedmetadata", scrollToBottom);

    return () => {
      media.removeEventListener("load", scrollToBottom);
      media.removeEventListener("loadedmetadata", scrollToBottom);
    };
  }, [messages]);

  const allImages =
    messages
      ?.filter((m: IMessage) => m.messageType === "image")
      .map((m: IMessage) => m.content) || [];

  return (
    <div
      ref={containerRef}
      className="
        flex-1 overflow-y-auto overscroll-contain touch-pan-y
        bg-(image:--bg-chat-tile-light)
        dark:bg-(image:--bg-chat-tile-dark)
        bg-repeat
        bg-size-[420px_420px]
        bg-position-y-[-2px]
      "
      style={{
           paddingTop: "64px", // header height
        paddingBottom: "calc(96px + env(safe-area-inset-bottom))",
      }}
    >
      <div className="px-3 md:px-12 pt-6 flex flex-col gap-3">
        {messages?.map((msg, idx) => (
          <ChatBubble
            key={msg._id}
            me={me}
            message={msg}
            previousMessage={idx > 0 ? messages[idx - 1] : undefined}
            allImages={allImages}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageContainer;
