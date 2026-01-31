"use client";

import { useState, useRef } from "react";
import { X, ArrowLeft, MessageSquare, Info } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useConversationStore } from "@/store/chat-store";
import type { UIConversation } from "@/types/conversation-ui";
import { formatDate } from "@/lib/utils";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";

type Props = {
  open: boolean;
  onClose: () => void;
  conversation: UIConversation;
};

export default function ProfilePreviewDialog({
  open,
  onClose,
  conversation,
}: Props) {
  const { setSelectedConversation } = useConversationStore();
  const [showInfo, setShowInfo] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const startY = useRef<number | null>(null);

  if (!open) return null;

  const name =
    conversation.groupName ||
    conversation.name ||
    "Unknown";

  const image =
    conversation.groupImage ||
    conversation.image ||
    "/placeholder.png";

  const createdAt = conversation.createdAt
    ? formatDate(conversation.createdAt)
    : "—";

  /* ================= SWIPE DOWN (FULLSCREEN) ================= */
  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startY.current === null) return;
    const endY = e.changedTouches[0].clientY;
    if (endY - startY.current > 120) {
      setShowFull(false);
    }
    startY.current = null;
  }

  return (
    <div className="fixed inset-0 z-100">
      {/* ================= FULLSCREEN IMAGE ================= */}
      {showFull && (
        <div
  className="fixed inset-0 bg-black z-120 flex flex-col animate-fade-in"
  onClick={() => setShowFull(false)}   // ✅ close on dark tap
>
          {/* HEADER */}
          <div className="flex items-center gap-3 px-3 py-2 text-white">
            <ArrowLeft
              size={22}
              className="cursor-pointer active:scale-95"
              onClick={() => setShowFull(false)}
            />
            <span className="text-sm truncate">{name}</span>
          </div>

          {/* IMAGE */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden"
             onClick={(e) => e.stopPropagation()}   // 🚫 don’t close when image tapped
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <TransformWrapper
              doubleClick={{ mode: "toggle" }}
              pinch={{ step: 5 }}
              panning={{ velocityDisabled: true }}
            >
              <TransformComponent>
                <img
                  src={image}
                  alt={name}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      )}

      {/* ================= PREVIEW ================= */}
      {!showFull && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center"
          onClick={onClose} // ✅ click outside closes
        >
          <div
            className="relative w-72 rounded-xl overflow-hidden bg-black animate-fade-in"
            onClick={(e) => e.stopPropagation()} // ❌ prevent close
          >
            {/* HEADER */}
            <div className="absolute top-0 left-0 w-full flex justify-between px-3 py-2 text-white bg-black/60 z-10">
              <span className="text-sm truncate">{name}</span>
              <X
                size={18}
                className="cursor-pointer active:scale-95"
                onClick={onClose}
              />
            </div>

            {/* IMAGE (HERO ENTRY) */}
            <div
              className="w-full aspect-square cursor-pointer transition-transform duration-300 active:scale-95"
              onClick={() => setShowFull(true)}
            >
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={image} className="object-cover" />
                <AvatarFallback />
              </Avatar>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-around py-3 border-t border-white/10">
              <button
                className="flex flex-col items-center gap-1 text-green-500 cursor-pointer active:scale-95"
                onClick={() => {
                  setSelectedConversation(conversation);
                  onClose();
                }}
              >
                <MessageSquare size={22} />
                <span className="text-xs">Message</span>
              </button>

              <button
                className="flex flex-col items-center gap-1 text-green-500 cursor-pointer active:scale-95"
                onClick={() => setShowInfo((v) => !v)}
              >
                <Info size={22} />
                <span className="text-xs">Info</span>
              </button>
            </div>

            {/* INFO PANEL */}
            {showInfo && (
              <div className="px-4 py-3 text-xs text-gray-300 space-y-2 border-t border-white/10">
                <div>
                  <span className="text-gray-400">Created:</span>
                  <br />
                  {createdAt}
                </div>

                {conversation.lastMessage && (
                  <div>
                    <span className="text-gray-400">Last message:</span>
                    <br />
                    {formatDate(conversation.lastMessage._creationTime)}
                  </div>
                )}

                <div>
                  <span className="text-gray-400">Type:</span>
                  <br />
                  {conversation.isGroup ? "Group chat" : "Direct message"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
