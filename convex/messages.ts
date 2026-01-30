import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

/* =========================
   SEND USER TEXT MESSAGE
========================= */
export const sendTextMessage = mutation({
  args: {
    sender: v.string(),
    content: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new ConvexError("User not found");

    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), args.conversation))
      .first();

    if (!conversation) throw new ConvexError("Conversation not found");

    if (!conversation.participants.includes(user._id)) {
      throw new ConvexError("You are not part of this conversation");
    }

    /* save USER message */
    await ctx.db.insert("messages", {
      sender: args.sender,
      content: args.content,
      conversation: args.conversation,
      messageType: "text",
    });

   if (args.content.startsWith("@gpt")) {
  await ctx.scheduler.runAfter(0, api.openai.freeTextAI, {
    messageBody: args.content,
    conversation: args.conversation,
  });
}


    /* trigger AI Horde */
if (args.content.startsWith("@ai")) {
  await ctx.scheduler.runAfter(0, api.openai.aihorde, {
    messageBody: args.content,
    conversation: args.conversation,
  });
}

  },
});

/* =========================
   CHATGPT MESSAGE ONLY
========================= */
export const sendChatGPTMessage = mutation({
  args: {
    content: v.string(),
    conversation: v.id("conversations"),
    messageType: v.union(v.literal("text"), v.literal("image")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      content: args.content,
      sender: "AI",
      messageType: args.messageType,
      conversation: args.conversation,
    });
  },
});

export const sendHORDEAIMessage = mutation({
  args: {
    content: v.string(),
    conversation: v.id("conversations"),
    messageType: v.literal("image"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      content: args.content,
      conversation: args.conversation,
      messageType: args.messageType,
      sender: "HORDE_AI",
    });
  },
});

export const sendAILoadingMessage = mutation({
  args: {
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      content: "__IMAGE_AI_LOADING__",
      conversation: args.conversation,
      messageType: "image",
      sender: "HORDE_AI",
    });
  },
});
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});


export const sendTextAILoadingMessage = mutation({
  args: {
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      content: "__TEXT_AI_LOADING__",
      conversation: args.conversation,
      messageType: "text",
      sender: "AI",
    });
  },
});


/* =========================
   GET MESSAGES (FIXED AI)
========================= */
export const getMessages = query({
  args: {
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversation", args.conversation)
      )
      .collect();

    const userProfileCache = new Map<string, any>();

    const messagesWithSender = await Promise.all(
      messages.map(async (message) => {
        /* 🤖 AI MESSAGES */
        if (message.sender === "AI" || message.sender === "HORDE_AI") {
          const image =
            message.sender === "AI" ? "/gpt.png" : "/hordeai.png";

          return {
            ...message,
            sender: {
              name: message.sender,
              image,
            },
          };
        }

        /* 👤 USER MESSAGES */
        let sender;
        if (userProfileCache.has(message.sender)) {
          sender = userProfileCache.get(message.sender);
        } else {
          sender = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), message.sender))
            .first();

          userProfileCache.set(message.sender, sender);
        }

        return { ...message, sender };
      })
    );

    return messagesWithSender;
  },
});

// Unoptimized getMessages (old version)
// export const getMessages = query({
//     args:{
//         conversation: v.id("conversations"),
//     },
//     handler : async (ctx,args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if(!identity) {
//             throw new ConvexError("Not authenticated") 
//         }

//         const messages = await ctx.db
//         .query("messages")
//         .withIndex("by_conversation", q=> q.eq("conversation", args.conversation))
//         .collect();

//         const messagesWithSender = await Promise.all(
//             messages.map(async (message) => {
//                 const sender = await ctx.db
//                 .query("users")
//                 .filter(q => q.eq(q.field("_id"), message.sender))
//                 .first();

//                 return { ...message, sender };
//             })
//         );

//         return messagesWithSender;
//     }
// });

export const sendImage = mutation({
	args: { imgId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const content = (await ctx.storage.getUrl(args.imgId)) as string;

		await ctx.db.insert("messages", {
			content: content,
			sender: args.sender,
			messageType: "image",
			conversation: args.conversation,
		});
	},
});

export const sendVideo = mutation({
	args: { videoId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const content = (await ctx.storage.getUrl(args.videoId)) as string;

		await ctx.db.insert("messages", {
			content: content,
			sender: args.sender,
			messageType: "video",
			conversation: args.conversation,
		});
	},
});