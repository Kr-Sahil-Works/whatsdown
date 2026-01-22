import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

const OFFLINE_AFTER = 40_000; // 40 seconds

// ─────────────────────────────────────────────
// CREATE USER
// ─────────────────────────────────────────────
export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
      name: args.name,
      image: args.image,
      lastSeen: Date.now(), // ✅ ONLY SOURCE OF TRUTH
    });
  },
});

// ─────────────────────────────────────────────
// UPDATE USER
// ─────────────────────────────────────────────
export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    image: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", q =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) throw new ConvexError("User not found");

    await ctx.db.patch(user._id, {
      image: args.image,
      name: args.name,
    });
  },
});

// ─────────────────────────────────────────────
// HEARTBEAT (CALL EVERY 30s FROM CLIENT)
// ─────────────────────────────────────────────
export const heartbeat = internalMutation({
  args: { tokenIdentifier: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", q =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) return;

    await ctx.db.patch(user._id, {
      lastSeen: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────
// GET USERS (COMPUTE isOnline)
// ─────────────────────────────────────────────
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const users = await ctx.db.query("users").collect();

    return users
      .filter(u => u.tokenIdentifier !== identity.tokenIdentifier)
      .map(u => ({
        ...u,
        isOnline: Date.now() - u.lastSeen < OFFLINE_AFTER,
      }));
  },
});

// ─────────────────────────────────────────────
// GET ME (COMPUTE isOnline)
// ─────────────────────────────────────────────
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", q =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new ConvexError("User not found");

    return {
      ...user,
      isOnline: Date.now() - user.lastSeen < OFFLINE_AFTER,
    };
  },
});
