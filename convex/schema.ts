import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
 users: defineTable({
  tokenIdentifier: v.string(),
  email: v.string(),
  name: v.string(),
  image: v.string(),
  isOnline: v.boolean(),
}).index("by_tokenIdentifier", ["tokenIdentifier"]),

  conversations: defineTable({
    participants : v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.string()),
    admin: v.optional(v.id("users")),
  }),

  messages: defineTable({
    conversation: v.id("conversations"),
    sender: v.string(),  // should be a string instead of v.id() so, it does not openai prompt messages 
    content: v.string(),
    messageType : v.union(v.literal("text"),v.literal("image"),v.literal("video")),
  }).index("by_conversation",["conversation"])
});


