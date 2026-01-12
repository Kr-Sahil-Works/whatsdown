import { messages } from "@/dummy-data/db";
import ChatBubble from "./chat-bubble";

const MessageContainer = () => {
  return (
    <div
      className="
        relative p-3 flex-1 overflow-auto
        bg-(image:--bg-chat-tile-light)
        dark:bg-(image:--bg-chat-tile-dark)
        bg-repeat
        bg-cover
      "
    >
      <div className="mx-12 flex flex-col gap-3 min-h-full">
        {messages?.map((msg) => (
          <div key={msg._id}>
            <ChatBubble />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageContainer;
