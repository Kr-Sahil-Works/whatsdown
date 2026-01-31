import type { Id } from "../../convex/_generated/dataModel";

export type UIConversation = {
  _id: Id<"conversations">;

  createdAt: number; // ✅ UI-friendly timestamp

  participants: Id<"users">[];
  isGroup: boolean;

  name?: string;
  image?: string;

  groupName?: string;
  groupImage?: string;
  admin?: Id<"users">;

  isOnline?: boolean;

  lastMessage?: {
    _id: Id<"messages">;
    content: string;
    sender: Id<"users">;
    _creationTime: number;
    messageType: "text" | "image" | "video";
  };
};
