import { IMessage, useConversationStore } from "@/store/chat-store"
import { useMutation } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import KickUserDialog from "./kick-user-dialog";
import { UserMinus } from "lucide-react";
import React from "react";


type ChatAvatarActionsProps = {
  message: IMessage;
  me:any;

}
const ChatAvatarActions = ({me,message}:ChatAvatarActionsProps) => {
  const {selectedConversation,setSelectedConversation} = useConversationStore();

  const isMember = selectedConversation?.participants.includes(message.sender._id);
  const KickUser = useMutation(api.conversations.kickUser);
  const createConversation = useMutation(api.conversations.createConversation);

  const handleKickUser = async (e:React.MouseEvent) => {
    e.stopPropagation();
    if(!selectedConversation) return;
        try {
          await KickUser({
            conversationId: selectedConversation._id,
            userId: message.sender._id
          })

          setSelectedConversation({
            ...selectedConversation,
            participants: selectedConversation.participants.filter((id) => id !== message.sender._id)
          })
        } catch (error) {
          toast.error("Failed to kick the user")
        }
  }

  const handleCreateConversation = async () => {
      try {
       const conversationId =  await createConversation({
          isGroup:false,
          participants:[me._id,message.sender._id]
        })

        setSelectedConversation({
          _id:conversationId,
          name:message.sender.name,
          participants: [me._id, message.sender._id],
          isGroup: false,
          isOnline: message.sender.isOnline,
          image: message.sender.image,
        })

      } catch (error) {
        toast.error("Failed to get user info")
      }
  }
  return <div 
  className="text-[10px] flex gap-2 justify-between font-bold cursor-pointer group"
  onClick={handleCreateConversation}
  >
    {message.sender.name}

    {!isMember && (
  <div className="relative group flex items-center">
    {/* Bold banned mark */}
   <div
  className="relative group flex items-center"
  onClick={(e) => e.stopPropagation()}
>
  <Ban size={14} className="text-red-500" />
</div>


    {/* Hover tooltip */}
    <span
      className="absolute left-5 top-1/2 -translate-y-1/2
      whitespace-nowrap rounded-md bg-black px-2 py-1
      text-[10px] text-white opacity-0
      group-hover:opacity-100 transition"
    >
      Removed by admin
    </span>
  </div>
)}

    {isMember && selectedConversation?.admin === me._id && (
  <KickUserDialog onConfirm={handleKickUser} />
)}

  </div>

}
export default ChatAvatarActions;