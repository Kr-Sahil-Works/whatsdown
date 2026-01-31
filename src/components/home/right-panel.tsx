"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X, ArrowLeft } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";
import { useConvexAuth } from "convex/react";
import { RightChatSkeleton } from "../home/chat-skeleton";

const RightPanel = () => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const { isLoading } = useConvexAuth();

  if (isLoading) return <RightChatSkeleton />;

  return (
    <div
      className={`
        flex flex-1 flex-col
        md:flex
        ${selectedConversation ? "flex" : "hidden md:flex"}
      `}
    >
      {!selectedConversation ? (
        <ChatPlaceHolder />
      ) : (
        <>
          {/* HEADER */}
          <div className="sticky top-0 z-50 bg-gray-primary">
            <div className="flex justify-between p-3">
              <div className="flex gap-2 items-center">
                {/* MOBILE BACK */}
                <ArrowLeft
                  size={20}
                  className="md:hidden cursor-pointer"
                  onClick={() => setSelectedConversation(null)}
                />

                <Avatar>
                  <AvatarImage
                    src={
                      selectedConversation.groupImage ||
                      selectedConversation.image ||
                      "/placeholder.png"
                    }
                  />
                  <AvatarFallback />
                </Avatar>

                <div className="flex flex-col">
                  <div>
                    {selectedConversation.groupName ||
                      selectedConversation.name}
                  </div>
                  {selectedConversation.isGroup && (
                    <GroupMembersDialog
                      selectedConversation={selectedConversation}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <a href="/video-call" target="_blank">
                  <Video size={22} />
                </a>
                <X
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setSelectedConversation(null)}
                />
              </div>
            </div>
          </div>

          {/* MESSAGES */}
          <MessageContainer />

          {/* INPUT */}
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default RightPanel;
