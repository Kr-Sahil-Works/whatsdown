"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Crown } from "lucide-react";
import { Conversation } from "@/store/chat-store";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type GroupMembersDialogProps = {
  selectedConversation:Conversation;
}


const GroupMembersDialog = ({selectedConversation}: GroupMembersDialogProps) => {
  const users = useQuery(api.users.getGroupMembers, {conversationId: selectedConversation._id});
  return (
    <Dialog>
      {/* FIX 1: p → div via asChild (no style change) */}
      <DialogTrigger asChild>
        <div className="text-xs text-muted-foreground text-left cursor-pointer">
          See members
        </div>
      </DialogTrigger>

      <DialogContent
  className="
    bg-white/20 dark:bg-black/30
    backdrop-blur-xl
    border border-white/20 dark:border-white/10
    shadow-2xl
    text-foreground
  "
>

        <DialogHeader>
          <DialogTitle className="my-2 text-white drop-shadow">Current Members</DialogTitle>

          {/* FIX 2: DialogDescription renders <p> */}
          <DialogDescription asChild>
            <div className="flex flex-col gap-3">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className="
  flex gap-3 items-center p-2 rounded-lg
  bg-white/10 dark:bg-black/20
  backdrop-blur-md
  border border-white/10
"

                >
                  <Avatar className="relative overflow-visible">
                    {/* FIX 3: div → span */}
                    {user.isOnline && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-foreground" />
                    )}

                    <AvatarImage
                      src={user.image}
                      className="rounded-full object-cover"
                    />

                    <AvatarFallback>
                      <span className="animate-pulse bg-gray-tertiary w-full h-full rounded-full block" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-medium">
                        {user.name || user.email.split("@")[0]}
                      </h3>
                      {user._id === selectedConversation.admin && (
                        <Crown size={16} className="text-yellow-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GroupMembersDialog;
