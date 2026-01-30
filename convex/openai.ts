import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const GROQ_API_KEY = process.env.FREETEXTAI!;


export const freeTextAI = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const prompt = args.messageBody.replace(/^@gpt/i, "").trim();
    if (!prompt) return;

    // 1️⃣ INSERT LOADER
    const loadingMessageId = await ctx.runMutation(
      api.messages.sendTextAILoadingMessage,
      { conversation: args.conversation }
    );

    try {
      // 🔍 DETECT IF USER WANTS LONG ANSWER
      const wantsLongAnswer =
        /(\b\d+\s*lines?\b)|(\bstory\b)|(\bparagraph\b)|(\blong\b)|(\bdetailed\b)|(\bexplain\b)/i.test(
          prompt
        );

      const maxTokens = wantsLongAnswer ? 300 : 90;

      const systemPrompt = wantsLongAnswer
        ? "Answer clearly with proper line breaks. Follow the user's requested length."
        : "Reply in 2–3 short lines only. Use simple words. Add line breaks. No explanations.";

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.FREETEXTAI}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            max_tokens: maxTokens,
            temperature: 0.3,
            top_p: 0.9,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
          }),
        }
      );

      const data = await res.json();

      // 2️⃣ REMOVE LOADER
      await ctx.runMutation(api.messages.deleteMessage, {
        messageId: loadingMessageId,
      });

      let output = data?.choices?.[0]?.message?.content;
      if (!output) throw new Error("No output");

      // ✂️ SAFETY TRIM ONLY FOR SHORT MODE
      if (!wantsLongAnswer) {
        output = output
          .split("\n")
          .slice(0, 3)
          .join("\n")
          .trim();
      }

      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content: output,
        conversation: args.conversation,
        messageType: "text",
      });
    } catch (err) {
      await ctx.runMutation(api.messages.deleteMessage, {
        messageId: loadingMessageId,
      });

      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content: "⚠️ AI service unavailable.",
        conversation: args.conversation,
        messageType: "text",
      });
    }
  },
});







export const aihorde = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const prompt = args.messageBody.replace(/^@ai/i, "").trim();
    if (!prompt) return;

    // 1️⃣ Insert loading message
    const loadingMessageId = await ctx.runMutation(
      api.messages.sendAILoadingMessage,
      { conversation: args.conversation }
    );

    // 2️⃣ Create Horde job
    const create = await fetch("https://aihorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        apikey: imageapiKey!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        params: { width: 512, height: 512, steps: 25 },
      }),
    });

    const { id } = await create.json();

    let imageUrl: string | null = null;

    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 3000));

      const check = await fetch(
        `https://aihorde.net/api/v2/generate/status/${id}`
      );
      const data = await check.json();

      if (data.done && data.generations?.length) {
        imageUrl = data.generations[0].img;
        break;
      }
    }

    // 3️⃣ Remove loading bubble
    await ctx.runMutation(api.messages.deleteMessage, {
      messageId: loadingMessageId,
    });

    if (!imageUrl) return;

    // 4️⃣ Insert final image
    await ctx.runMutation(api.messages.sendHORDEAIMessage, {
      content: imageUrl,
      conversation: args.conversation,
      messageType: "image",
    });
  },
});

const imageapiKey = process.env.HORDEAI_API_KEY;