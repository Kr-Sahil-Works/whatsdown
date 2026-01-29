"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { LogOut } from "lucide-react";

type KickUserDialogProps = {
  onConfirm: (e: React.MouseEvent) => void;
};

export default function KickUserDialog({ onConfirm }: KickUserDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <LogOut
          size={15}
          className="text-red-500 opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Blur background */}
        <Dialog.Overlay
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
          onClick={(e) => e.stopPropagation()}
        />

        <Dialog.Content
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 left-1/2 top-1/2 w-[320px]
          -translate-x-1/2 -translate-y-1/2 rounded-lg
          bg-neutral-900 text-white shadow-xl"
        >
          {/* Required for accessibility */}
          <Dialog.Title className="sr-only">
            Kick user confirmation
          </Dialog.Title>

          {/* Header */}
          <div className="bg-red-600 px-4 py-2 rounded-t-lg font-bold">
            Kick User
          </div>

          {/* Body */}
          <div className="px-4 py-4 text-sm text-gray-300">
            Are you sure you want to kick this user?
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 px-4 pb-4">
            <Dialog.Close
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1 rounded bg-neutral-700 text-sm"
            >
              Cancel
            </Dialog.Close>

            <Dialog.Close
              onClick={onConfirm}
              className="px-3 py-1 rounded bg-red-600 text-sm"
            >
              Kick
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
