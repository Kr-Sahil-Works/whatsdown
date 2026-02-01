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
      {/* ================= MOBILE ================= */}
      <div
        className={`
          flex flex-col w-full h-full
          lg:hidden
          ${selectedConversation ? "hidden" : "flex"}
          bg-container
        `}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-gray-primary/95 backdrop-blur shadow-sm">
          <div className="flex justify-between items-center px-3 py-2.5">
            {/* LOGO */}
            <div className="ml-2">
              <span
                className="
                  text-[1.125rem]   /* 18px */
                  font-semibold
                  leading-none
                  tracking-tight
                  text-[#25D366]
                  cursor-pointer
                "
              >
                WhatsPlus
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-1">
              <div className="header-action h-11 w-11 flex items-center justify-center">
                <UserListDialog />
              </div>

              <div className="header-action h-11 w-11 flex items-center justify-center">
                <ThemeSwitch />
              </div>

              {isAuthenticated && (
                <div className="header-action h-11 w-11 flex items-center justify-center mr-3">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="px-3 pb-3 w-[96%] mx-auto">
            <SearchInput />
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto px-2 pt-3">
          {filtered?.map((c, index) => (
            <div key={c._id}>
              <Conversation conversation={c} onAvatarClick={() => onPreview(c)} />
              {index !== filtered.length - 1 && (
                <div className="mx-3 h-px bg-border/60 dark:bg-border/40" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <Sidebar className="hidden lg:flex w-95 shrink-0 border-r bg-container">
        <SidebarHeader className="bg-gray-primary/95 backdrop-blur shadow-sm">
          <div className="flex justify-between items-center px-3 py-2.5">
            {/* LOGO */}
            <div className="ml-2">
              <span
                className="
                  text-[1.125rem]
                  font-semibold
                  leading-none
                  tracking-tight
                  text-[#25D366]
                  cursor-pointer
                "
              >
                WhatsPlus
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-1">
              <div className="header-action h-11 w-11 flex items-center justify-center">
                <UserListDialog />
              </div>

              <div className="header-action h-11 w-11 flex items-center justify-center">
                <ThemeSwitch />
              </div>

              {isAuthenticated && (
                <div className="header-action h-11 w-11 flex items-center justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="px-3 pb-3 w-[96%] mx-auto">
            <SearchInput />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 pt-3 pb-2">
          {filtered?.map((c, index) => (
            <div key={c._id}>
              <Conversation conversation={c} onAvatarClick={() => onPreview(c)} />
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
