import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageSeenSvg } from "@/lib/svgs";
import { ImageIcon, Users, VideoIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";

type Props = {
  conversation: any;
  onAvatarClick?: () => void;
};

const Conversation = ({ conversation, onAvatarClick }: Props) => {
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
        relative
        flex items-center gap-4
        px-4 py-3
        rounded-2xl
        cursor-pointer
        mb-2

        bg-gray-secondary/60 dark:bg-gray-secondary/40

        transition-all duration-200 ease-out

        hover:bg-black/10 dark:hover:bg-white/10
        hover:shadow-md
        hover:-translate-y-[1px]

        ${isActive ? "bg-gray-tertiary shadow-md" : ""}
      `}
    >
      {/* AVATAR */}
      <Avatar
        className="
          relative shrink-0
          h-12 w-12            /* ✅ BIGGER SIZE */
          cursor-pointer      /* ✅ POINTER */
          transition-transform duration-200
          hover:scale-105     /* ✅ subtle hover pop */
        "
        onClick={(e) => {
          e.stopPropagation();
          onAvatarClick?.();
        }}
      >
        {conversation.isOnline && (
          <>
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500/30 animate-pulse" />
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
