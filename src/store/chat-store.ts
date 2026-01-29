import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";

/* =======================
   TYPES
======================= */

export type Conversation = {
  _id: Id<"conversations">;
  image?: string;
  participants: Id<"users">[];
  isGroup: boolean;
  name?: string;
  groupImage?: string;
  groupName?: string;
  admin?: Id<"users">;
  isOnline?: boolean;
  lastMessage?: {
    _id: Id<"messages">;
    conversation: Id<"conversations">;
    content: string;
    sender: Id<"users">;
  };
};

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
};

/* =======================
   STORE
======================= */

type ConversationStore = {
  // selected chat
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;

  // 👇 LeftPanel (chat list) visibility
  isChatListOpen: boolean;
  setChatListOpen: (open: boolean) => void;

  // 👇 User list dialog (start new chat)
  isUserListOpen: boolean;
  setUserListOpen: (open: boolean) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  // selected chat
  selectedConversation: null,
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),

  // LeftPanel open / close
  isChatListOpen: true,
  setChatListOpen: (open) => set({ isChatListOpen: open }),

  // UserListDialog open / close
  isUserListOpen: false,
  setUserListOpen: (open) => set({ isUserListOpen: open }),
}));
