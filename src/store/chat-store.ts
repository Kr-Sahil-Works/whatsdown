import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";
import type { UIConversation } from "@/types/conversation-ui";

/* ================= UI STORE ================= */

type ConversationStore = {
  selectedConversation: UIConversation | null;
  setSelectedConversation: (c: UIConversation | null) => void;

  isChatListOpen: boolean;
  setChatListOpen: (open: boolean) => void;

  isUserListOpen: boolean;
  setUserListOpen: (open: boolean) => void;

  search: string;
  setSearch: (value: string) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (c) => set({ selectedConversation: c }),

  isChatListOpen: true,
  setChatListOpen: (open) => set({ isChatListOpen: open }),

  isUserListOpen: false,
  setUserListOpen: (open) => set({ isUserListOpen: open }),

  search: "",
  setSearch: (value) => set({ search: value }),
}));
export interface IMessage {
  _id: string;
  content: string;
  _creationTime: number;
  messageType: "text" | "image" | "video";
  sender: {
    _id: Id<"users">;
    image: string;
    name?: string;
    tokenIdentifier: string;
    email: string;
    _creationTime: number;
    isOnline: boolean;
  };
}
