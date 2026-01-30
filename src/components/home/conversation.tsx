import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageSeenSvg } from "@/lib/svgs";
import { ImageIcon, Users, VideoIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";

const Conversation = ({ conversation }: { conversation: any }) => {
  const conversationImage = conversation.groupImage || conversation.image;
  const conversationName = conversation.groupName || conversation.name;
  const lastMessage = conversation.lastMessage;
  const lastMessageType = lastMessage?.messageType;
  const me = useQuery(api.users.getMe);

  const { setSelectedConversation, selectedConversation } =
    useConversationStore();

  const isActive = selectedConversation?._id === conversation._id;

  return (
    <div
      onClick={() => setSelectedConversation(conversation)}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
        transition-all duration-150
        ${
          isActive
            ? "bg-gray-tertiary shadow-md"
            : "bg-card hover:bg-chat-hover hover:shadow-sm"
        }
      `}
    >
      {/* AVATAR */}
      <Avatar className="relative shrink-0">
        {conversation.isOnline && (
  <>
    {/* Outer glow ring */}
    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500/30 animate-pulse" />

    {/* Solid dot */}
    <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-green-600 border-2 border-background" />
  </>
)}

        <AvatarImage
          src={conversationImage || "/placeholder.png"}
          className="object-cover"
        />
        <AvatarFallback>
          <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
        </AvatarFallback>
      </Avatar>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium truncate">
            {conversationName}
          </h3>
          <span className="text-xs text-muted-foreground">
            {formatDate(
              lastMessage?._creationTime || conversation._creationTime
            )}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
          {lastMessage?.sender === me?._id && <MessageSeenSvg />}

          {conversation.isGroup && <Users size={12} />}

          {!lastMessage && "Hi, How are you today?"}

          {lastMessageType === "text" && (
            <span className="truncate">
              {lastMessage.content.length > 30
                ? lastMessage.content.slice(0, 30) + "…"
                : lastMessage.content}
            </span>
          )}

          {lastMessageType === "image" && <ImageIcon size={14} />}
          {lastMessageType === "video" && <VideoIcon size={14} />}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
