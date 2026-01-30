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



const LeftPanel = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const conversations = useQuery(
    api.conversations.getMyConversations,
    isAuthenticated ? undefined : "skip"
  ) as UIConversation[] | undefined;

  const {
    selectedConversation,
    setSelectedConversation,
    isChatListOpen,
    search,
  } = useConversationStore();

  /* =====================
     CLEANUP SELECTED CHAT
  ===================== */
  useEffect(() => {
    const ids = conversations?.map((c) => c._id);
    if (selectedConversation && ids && !ids.includes(selectedConversation._id)) {
      setSelectedConversation(null);
    }
  }, [conversations, selectedConversation, setSelectedConversation]);

  if (isLoading) return <LeftSidebarSkeleton />;

  /* =====================
     SEARCH FILTER (FIXED)
  ===================== */
  const filteredConversations = conversations?.filter((c) => {
    if (!search) return true;

    const name = c.isGroup
      ? c.groupName ?? ""
      : c.name ?? "";

    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Sidebar
      className="border-r bg-background"
      collapsible="full"
      collapsed={!isChatListOpen}
    >
      {/* HEADER */}
      <SidebarHeader className="sticky top-0 z-20 border-b bg-background">
        <div className="flex items-center justify-between px-3 py-2">
          {isAuthenticated && (
  <div className="scale-120 origin-left">
    <UserButton />
  </div>
)}

          <div className="flex items-center gap-2">
            <UserListDialog />
            <ThemeSwitch />
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-3 pb-3">
          <SearchInput />
        </div>
      </SidebarHeader>

      {/* CHAT LIST */}
      <SidebarContent className="px-2 py-2">
        <div className="flex flex-col gap-1">
          {filteredConversations?.map((conversation) => (
            <Conversation
              key={conversation._id}
              conversation={conversation}
            />
          ))}

          {filteredConversations?.length === 0 && search && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No chats found
            </p>
          )}

          {conversations?.length === 0 && !search && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>No conversations yet</p>
              <p className="mt-1">Even introverts need one chat 🙂</p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default LeftPanel;
