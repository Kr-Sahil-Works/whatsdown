"use client";

import { UserButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import { LeftSidebarSkeleton } from "../home/chat-skeleton";
import ThemeSwitch from "./theme-switch";
import UserListDialog from "./user-list-dialog";
import Conversation from "./conversation";
import SearchInput from "./search-input";
import type { UIConversation } from "@/types/conversation-ui";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";

type Props = {
  onPreview: (c: UIConversation | null) => void;
};

export default function LeftPanel({ onPreview }: Props) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const conversations = useQuery(
    api.conversations.getMyConversations,
    isAuthenticated ? undefined : "skip"
  ) as UIConversation[] | undefined;

  const { selectedConversation, setSelectedConversation, search } =
    useConversationStore();

  useEffect(() => {
    const ids = conversations?.map((c) => c._id);
    if (selectedConversation && ids && !ids.includes(selectedConversation._id)) {
      setSelectedConversation(null);
    }
  }, [conversations, selectedConversation, setSelectedConversation]);

  if (isLoading) return <LeftSidebarSkeleton />;

  const filtered = conversations?.filter((c) => {
    const name = c.isGroup ? c.groupName ?? "" : c.name ?? "";
    return !search || name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      {/* ================= MOBILE + TABLET (<1024px) ================= */}
      <div
        className={`
          flex flex-col w-full h-full
          lg:hidden
          ${selectedConversation ? "hidden" : "flex"}
          bg-container
        `}
      >
        <div className="sticky top-0 z-20 border-b bg-gray-primary">
          <div className="flex justify-between px-3 py-2 mt-0.5">
            {isAuthenticated && (
              <div className="scale-135 pt-1 origin-left ml-2">
                <UserButton />
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <UserListDialog />
              </div>

              <div className="mr-3 pt-1.5 scale-[0.99]">
                <ThemeSwitch />
              </div>
            </div>
          </div>

          <div className="px-3 pb-3 w-[96%] mx-auto">
            <SearchInput />
          </div>
        </div>

        {/* ✅ CONVERSATIONS + SEPARATORS */}
        <div className="flex-1 overflow-y-auto px-2 pt-3">
          {filtered?.map((c, index) => (
            <div key={c._id}>
              <Conversation
                conversation={c}
                onAvatarClick={() => onPreview(c)}
              />

              {/* WhatsApp-style separator */}
              {index !== filtered.length - 1 && (
                <div className="mx-3 h-px bg-border/60 dark:bg-border/40" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP (≥1024px) ================= */}
      <Sidebar
        className="
          hidden lg:flex
          w-95 shrink-0
          border-r
          bg-container
        "
      >
        <SidebarHeader className="border-b bg-gray-primary">
          <div className="flex justify-between px-3 py-2">
            {isAuthenticated && (
              <div className="scale-135 pt-1 origin-left ml-2">
                <UserButton />
              </div>
            )}

            <div className="flex gap-2">
              <UserListDialog />
              <div className="mr-2 pt-1.5 scale-[0.99]">
                <ThemeSwitch />
              </div>
            </div>
          </div>

          <div className="px-3 pb-3 w-[96%] mx-auto">
            <SearchInput />
          </div>
        </SidebarHeader>

        {/* ✅ CONVERSATIONS + SEPARATORS */}
        <SidebarContent className="px-2 pt-3 pb-2">
          {filtered?.map((c, index) => (
            <div key={c._id}>
              <Conversation
                conversation={c}
                onAvatarClick={() => onPreview(c)}
              />

              {/* WhatsApp-style separator */}
              {index !== filtered.length - 1 && (
                <div className="mx-3 h-px bg-border/60 dark:bg-border/40" />
              )}
            </div>
          ))}
        </SidebarContent>
      </Sidebar>
    </>
  );
}
