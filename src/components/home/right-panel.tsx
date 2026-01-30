"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";
import { ArrowLeft } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { RightChatSkeleton } from "../home/chat-skeleton";

const RightPanel = () => {
  const{ selectedConversation, setSelectedConversation} = useConversationStore();
  const {isLoading} = useConvexAuth();
  
  if (isLoading) return <RightChatSkeleton />;
  if (!selectedConversation) return <ChatPlaceHolder />;
  const conversationName = selectedConversation.groupName || selectedConversation.name;
  const conversationImage = selectedConversation.groupImage || selectedConversation.image;
 

  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full sticky top-0 z-50">
        {/* Header */}
        <div className="flex justify-between bg-gray-primary p-3">
         <div className="flex gap-2 items-center">
  {/* BACK BUTTON (WhatsApp style) */}
  <ArrowLeft
    size={20}
    className="cursor-pointer text-gray-400 hover:text-white"
    onClick={() => setSelectedConversation(null)}
  />

  <Avatar>
              <AvatarImage src={conversationImage || "/placeholder.png"} className="object-cover" />
              <AvatarFallback>
                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              {/* FIX: p → div (no value change) */}
              <div>{conversationName}</div>
              {selectedConversation.isGroup && <GroupMembersDialog  selectedConversation= {selectedConversation} />}
            </div>
          </div>

          <div className="flex items-center gap-7 mr-5">
            <a href="/video-call" target="_blank">
              <Video size={23} />
            </a>
            <X size={16} className="cursor-pointer" onClick={() => setSelectedConversation(null)} />
          </div>
        </div>
      </div>

      {/* CHAT MESSAGES */}
      <MessageContainer />

      {/* INPUT */}
      <MessageInput />
    </div>
  );
};

export default RightPanel;
 