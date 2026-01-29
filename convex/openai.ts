import OpenAI from 'openai';
import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apiKey});


export const chat= action({
    args:{
        messageBody: v.string(),
        conversation: v.id("conversations"),
    },
    handler: async(ctx,args) => {
        const res = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
             messages: [
    { role: "system", content: "You are a helpful assistant chatbot in a whatsapp like in chat application little funny cool but useful and accurate and give max from 1 to 5-6 sentence only more sentence if really needed to fill the answer or user ask you to give in more lines" },
    { role: "user", content: args.messageBody },
  ],
        })

      const messageContent =  res.choices[0].message.content

      await ctx.runMutation(api.messages.sendChatGPTMessage,{
        content: messageContent?? "I'm sorry, I don't have a response for that :(",
        conversation:args.conversation,
      })
    }
})
