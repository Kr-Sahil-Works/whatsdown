import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
 users: defineTable({
  tokenIdentifier: v.string(),
  email: v.string(),
  name: v.string(),
  image: v.string(),
  lastSeen: v.number(),
}).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
