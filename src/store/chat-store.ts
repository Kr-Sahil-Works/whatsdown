import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";

export type Conversation = {
  _id: Id<"conversations">;
  _creationTime: number;
  image?: string;
  participants: Id<"users">[];
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  admin?: Id<"users">;
  name?: string; // 👈 comes from userDetails
  isOnline?: boolean;
  lastMessage?: {
    _id: Id<"messages">;
    content: string;
    sender: Id<"users">;
    _creationTime: number;
    messageType: "text" | "image" | "video";
  };
};

type ConversationStore = {
  selectedConversation: Conversation | null;
  setSelectedConversation: (c: Conversation | null) => void;

  isChatListOpen: boolean;
  setChatListOpen: (open: boolean) => void;

  isUserListOpen: boolean;
  setUserListOpen: (open: boolean) => void;

  // ✅ SEARCH
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

  // ✅ SEARCH
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