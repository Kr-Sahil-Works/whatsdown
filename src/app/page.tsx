"use client";

import { useState } from "react";
import LeftPanel from "../components/home/left-panel";
import RightPanel from "../components/home/right-panel";
import ProfilePreviewDialog from "../components/home/profile-preview-dialog";
import { useConversationStore } from "@/store/chat-store";
import type { UIConversation } from "@/types/conversation-ui";

export default function Home() {
  const { selectedConversation } = useConversationStore();
  const [previewConversation, setPreviewConversation] =
    useState<UIConversation | null>(null);

  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-container">
      <div className="relative z-10 flex h-full w-full">
        {/* LEFT — ALWAYS ON DESKTOP */}
        <LeftPanel onPreview={setPreviewConversation} />

        {/* RIGHT — DESKTOP */}
        <div className="hidden md:flex flex-1 min-h-0">
          <RightPanel />
        </div>

        {/* RIGHT — MOBILE */}
        {selectedConversation && (
          <div className="md:hidden fixed inset-y-0 right-0 w-full z-40">
            <RightPanel />
          </div>
        )}
      </div>

      {/* PROFILE PREVIEW */}
      {previewConversation && (
        <ProfilePreviewDialog
          open
          onClose={() => setPreviewConversation(null)}
          conversation={previewConversation}
        />
      )}
    </main>
  );
}
