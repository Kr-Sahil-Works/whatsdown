"use client";

import { Lock } from "lucide-react";
import Image from "next/image";
import DotGrid from "./DotGrid";
// import CurvedLoop from "./CurvedLoop";
import { useConversationStore } from "@/store/chat-store";


import "./chat-placeholder.css";
import FancyButton from "./FancyButton";


const ChatPlaceHolder = () => {
  const { setChatListOpen, setUserListOpen } = useConversationStore();


  return (
    <div
      className="relative flex w-full md:w-3/4 h-full items-center justify-center overflow-hidden
      bg-linear-to-br from-gray-100 via-green-100/70 to-gray-200
      dark:from-neutral-900 dark:via-green-900/40 dark:to-neutral-800"
    >
      {/* DotGrid background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={4}
          gap={18}
          baseColor="#9CA3AF"
          activeColor="#22C55E"
          proximity={220}
          shockRadius={320}
          shockStrength={9}
          resistance={420}
          returnDuration={1.8}
        />
      </div>

      {/* glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-400/20 rounded-full blur-3xl z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-500/15 rounded-full blur-3xl z-10" />

      {/* glass chat card */}
      <div
        className="relative z-20 w-full max-w-lg h-105 rounded-2xl
        border border-white/40 dark:border-white/10
        bg-white/60 dark:bg-white/8
        backdrop-blur-2xl
        shadow-2xl px-5 py-4 overflow-hidden
        animate-float"
      >
        {/* animated chat stream */}
        <div className="space-y-4 mt-4 chat-loop">


  {/* user 1 */}
  <div className="flex items-end gap-2 animate-chat-left delay-200">
    <Image src="/user1.png" width={28} height={28} alt="" className="rounded-full" />
    <div className="bg-gray-200 dark:bg-neutral-700 px-3 py-2 rounded-2xl rounded-bl-none text-sm">
      Hey 👋
    </div>
  </div>

  {/* user 2 */}
  <div className="flex items-end gap-2 justify-end animate-chat-right delay-400">
    <div className="bg-green-500 text-white px-3 py-2 rounded-2xl rounded-br-none text-sm">
      Hi! What’s up?
    </div>
    <Image src="/user2.png" width={28} height={28} alt="" className="rounded-full" />
  </div>

  {/* user 1 */}
  <div className="flex items-end gap-2 animate-chat-left delay-600">
    <Image src="/user1.png" width={28} height={28} alt="" className="rounded-full" />
    <div className="bg-gray-200 dark:bg-neutral-700 px-3 py-2 rounded-2xl rounded-bl-none text-sm">
      This app feels smooth ✨
    </div>
  </div>

  {/* typing indicator */}
  <div className="flex items-end gap-2 animate-chat-left delay-800">
    <Image src="/user1.png" width={28} height={28} alt="" className="rounded-full" />
    <div className="bg-gray-200 dark:bg-neutral-700 px-4 py-2 rounded-2xl rounded-bl-none flex gap-1">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  </div>

  {/* user 2 */}
  <div className="flex items-end gap-2 justify-end animate-chat-right delay-1000">
    <div className="bg-green-500 text-white px-3 py-2 rounded-2xl rounded-br-none text-sm">
      Very WhatsApp-like 😎
    </div>
    <Image src="/user2.png" width={28} height={28} alt="" className="rounded-full" />
  </div>

</div>


      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
  <FancyButton
    onClick={() => {
      setChatListOpen(true);
      setUserListOpen(true);
    }}
  />
</div>
      



      </div>


      {/* footer */}
      <p className="absolute bottom-4 z-20 text-[10px] text-gray-600 dark:text-gray-400 flex items-center gap-1">
        <Lock size={10} />
        Your personal messages are end-to-end encrypted
      </p>
    </div>
  );
};

export default ChatPlaceHolder;
