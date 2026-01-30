import { Id } from "../../convex/_generated/dataModel";

/**
 * Frontend-only conversation type
 * This matches what getMyConversations ACTUALLY returns
 */
export type UIConversation = {
  _id: Id<"conversations">;

  // conversation meta
  isGroup: boolean;
  participants: Id<"users">[];

  // names & images (added at runtime)
  name?: string;        // DM name (from userDetails)
  image?: string;
  groupName?: string;
  groupImage?: string;

  // last message
  lastMessage?: {
    _id: Id<"messages">;
    _creationTime: number;
    content: string;
    messageType: "text" | "image" | "video";
    sender: Id<"users">;
  } | null;
};
