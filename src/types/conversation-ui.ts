import type { Id } from "../../convex/_generated/dataModel";
import type { Conversation } from "@/store/chat-store";

/**
 * UIConversation
 * ----------------
 * Extends the base Conversation type from the store
 * and adds frontend-only fields returned by getMyConversations
 */
export type UIConversation = Conversation & {
  // frontend-only / derived fields
  name?: string;
  image?: string;
  isOnline?: boolean;

  lastMessage?: {
    _id: Id<"messages">;
    content: string;
    sender: Id<"users">;
    _creationTime: number;
    messageType: "text" | "image" | "video";
  };
};
