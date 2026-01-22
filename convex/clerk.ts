"use node";

import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

const WEB_HOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

export const fulfill = internalAction({
  args: {
    headers: v.any(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    const wh = new Webhook(WEB_HOOK_SECRET);
    const event = wh.verify(
      args.payload,
      args.headers
    ) as WebhookEvent;

    return event;
  },
});
