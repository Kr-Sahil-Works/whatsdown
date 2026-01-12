"use client";

import { users } from "@/dummy-data/db";
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

const GroupMembersDialog = () => {
  return (
    <Dialog>
      {/* FIX 1: p → div via asChild (no style change) */}
      <DialogTrigger asChild>
        <div className="text-xs text-muted-foreground text-left cursor-pointer">
          See members
        </div>
      </DialogTrigger>

      <DialogContent className="bg-[#87aa0a] dark:bg-[#8caa2071]">
        <DialogHeader>
          <DialogTitle className="my-2">Current Members</DialogTitle>

          {/* FIX 2: DialogDescription renders <p> */}
          <DialogDescription asChild>
            <div className="flex flex-col gap-3">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className="flex gap-3 items-center p-2 rounded"
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
                      {user.admin && (
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
