"use client";

import { useEffect, useRef } from "react";
import { randomID } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function VideoUIKit() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const roomID = randomID(6);
  const { user } = useClerk();

  useEffect(() => {
    if (!user || !containerRef.current) return;

    const initMeeting = async () => {
      const res = await fetch(`/api/zegocloud?userID=${user.id}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("Token API failed:", text);
        return;
      }

      const { token, appID } = await res.json();

      const username =
        user.fullName ||
        user.emailAddresses[0].emailAddress.split("@")[0];

      const kitToken =
        ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          roomID,
          user.id,
          username
        );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current!,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
      });
    };

    initMeeting();
  }, [user, roomID]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
