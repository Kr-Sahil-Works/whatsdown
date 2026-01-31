"use client";

import { useState } from "react";
import { X, MessageSquare, Info } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useConversationStore } from "@/store/chat-store";
import type { UIConversation } from "@/types/conversation-ui";
import { formatDate } from "@/lib/utils";

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

  if (!open) return null;

  const name =
    conversation.groupName ||
    conversation.name ||
    "Unknown";

  const image =
    conversation.groupImage ||
    conversation.image ||
    "/placeholder.png";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center"
      onClick={onClose}
    >
      {/* BLURRED BACKDROP */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* DIALOG */}
      <div
        className="relative w-70 rounded-lg overflow-hidden bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-3 py-2 text-white bg-black/60 z-10">
          <span className="text-sm font-medium truncate">{name}</span>
          <X size={18} className="cursor-pointer" onClick={onClose} />
        </div>

        {/* IMAGE */}
        <div className="w-full aspect-square bg-black">
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage src={image} className="object-cover" />
            <AvatarFallback />
          </Avatar>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-around items-center py-3 bg-black border-t border-white/10">
          {/* MESSAGE */}
          <button
            className="flex flex-col items-center gap-1 text-green-500"
            onClick={() => {
              setSelectedConversation(conversation);
              onClose();
            }}
          >
            <MessageSquare size={22} />
            <span className="text-xs">Message</span>
          </button>

          {/* INFO */}
          <button
            className="flex flex-col items-center gap-1 text-green-500"
            onClick={() => setShowInfo((v) => !v)}
          >
            <Info size={22} />
            <span className="text-xs">Info</span>
          </button>
        </div>

        {/* INFO PANEL */}
        {showInfo && (
          <div className="bg-black border-t border-white/10 px-4 py-3 text-xs text-gray-300 space-y-2">
            <div>
              <span className="text-gray-400">Conversation created:</span>
              <br />
              {formatDate(conversation.createdAt)}
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
  );
}
