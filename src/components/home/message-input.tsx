"use client";

import { Laugh, Mic, Send, CheckCheck } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import toast from "react-hot-toast";
import useComponentVisible from "@/hooks/useComponentVisible";
import EmojiPicker, { Theme } from "emoji-picker-react";
import MediaDropdown from "./media-dropdown";

/* ================= ICON BUTTON ================= */
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
      transition-all duration-150
      hover:bg-gray-200/60 dark:hover:bg-gray-700/60
      active:scale-95
      ${active ? "bg-gray-300/70 dark:bg-gray-700" : ""}
    `}
  >
    {children}
  </button>
);

/* ================= LOADER ================= */
const FastSpinner = () => (
  <span
    className="
      h-4 w-4 rounded-full
      border-[2.5px] border-[whitesmoke]
      border-t-transparent
      animate-[spin_0.25s_linear_infinite]
    "
  />
);


/* ================= MESSAGE INPUT ================= */
const MessageInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [msgText, setMsgText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentDone, setSentDone] = useState(false);

  const { selectedConversation } = useConversationStore();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

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

      setMsgText("");

      // ✅ keep keyboard open
      setTimeout(() => inputRef.current?.focus(), 0);

      setTimeout(() => {
        setSentDone(true);
        setIsSending(false);
      }, 120);

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
    px-2 pt-2
    pb-[calc(env(safe-area-inset-bottom)+8px)]
  "
>

      <form
        onSubmit={handleSentTextMsg}
        className="flex items-end gap-2"
      >
        {/* ===== MAIN INPUT PILL (WhatsApp style) ===== */}
        <div
          className="
            flex flex-1 items-center gap-1
            bg-gray-tertiary
            rounded-full
            px-2 py-1.5
            shadow-sm
          "
        >
          {/* Emoji */}
          <div ref={ref} className="relative">
            {isComponentVisible && (
              <EmojiPicker
                theme={Theme.DARK}
                onEmojiClick={(emojiObject) =>
                  setMsgText((prev) => prev + emojiObject.emoji)
                }
                style={{
                  position: "absolute",
                  bottom: "2.5rem",
                  left: "0",
                  zIndex: 50,
                }}
              />
            )}

            <IconBtn
              onClick={() => setIsComponentVisible((v) => !v)}
              active={isComponentVisible}
            >
              <Laugh className="h-5 w-5" />
            </IconBtn>
          </div>

          {/* Media */}
          <IconBtn>
            <MediaDropdown />
          </IconBtn>

          {/* Text input */}
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            className="
              flex-1
              border-0
              bg-transparent
              px-2
              py-2
              text-sm
              focus-visible:ring-0
              focus-visible:ring-offset-0
            "
          />
        </div>

        {/* ===== SEND / MIC BUTTON ===== */}
        <Button
          type="submit"
          size="icon"
          disabled={isSending}
          onMouseDown={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className="
            h-11 w-11 rounded-full
            bg-green-primary text-white
            hover:bg-green-primary
            active:scale-95
            disabled:opacity-70
          "
        >
          {isSending ? (
  <FastSpinner />
) : sentDone ? (
  <CheckCheck className="scale-110 text-white" />
) : msgText.length > 0 ? (
  <Send />
) : (
  <Mic />
)}

        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
