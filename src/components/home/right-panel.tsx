"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X, ArrowLeft } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";
import { useConvexAuth } from "convex/react";
import { RightChatSkeleton } from "../home/chat-skeleton";
import ProfilePreviewDialog from "./profile-preview-dialog";

const ANIMATION_MS = 300;

const RightPanel = () => {
  const [showProfile, setShowProfile] = useState(false);
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const { isLoading } = useConvexAuth();

  const [isClosing, setIsClosing] = useState(false);

  // ⏳ delay unmount until animation finishes
  useEffect(() => {
    if (!isClosing) return;

    const timer = setTimeout(() => {
      setSelectedConversation(null);
      setIsClosing(false);
    }, ANIMATION_MS);

    return () => clearTimeout(timer);
  }, [isClosing, setSelectedConversation]);

  if (isLoading) return <RightChatSkeleton />;

  // 👇 KEEP PANEL MOUNTED during animation
  const isVisible = !!selectedConversation || isClosing;
  

  return (
    <div
      className={`
        fixed inset-0 z-40
        w-full h-dvh
        md:relative md:inset-auto md:flex-1 md:h-full
        bg-background
        flex flex-col
        transition-transform duration-300 ease-out
        md:translate-x-0
        ${isClosing ? "translate-x-full" : "translate-x-0"}
      `}
    >
      {/* DESKTOP PLACEHOLDER */}
      {!selectedConversation && (
        <div className="hidden lg:flex flex-1">
          <ChatPlaceHolder />
        </div>
      )}

      {/* CHAT VIEW (ALWAYS MOUNTED) */}
      {selectedConversation && (
        <>
          {/* HEADER */}
          <div className="sticky top-0 shrink-0 z-50 bg-gray-primary touch-auto">
            <div className="flex justify-between p-3">
              <div className="flex gap-2 items-center">
                <ArrowLeft
                  size={22}
                  className="cursor-pointer mr-2"
                  onClick={() => setIsClosing(true)}
                />

                <Avatar
                  className="cursor-pointer"
                  onClick={() => setShowProfile(true)}
                >
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
                  onClick={() => setIsClosing(true)}
                />
              </div>
            </div>
          </div>

          {/* CHAT + INPUT */}
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <MessageContainer />
            <MessageInput />
          </div>
        </>
      )}

      {/* PROFILE PREVIEW */}
      {selectedConversation && (
        <ProfilePreviewDialog
          open={showProfile}
          onClose={() => setShowProfile(false)}
          conversation={selectedConversation}
        />
      )}
    </div>
  );
};

export default RightPanel;
