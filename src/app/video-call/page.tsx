"use client";

import dynamic from "next/dynamic";

const VideoUI = dynamic(() => import("./video-ui-kit"), {
  ssr: false,
});

export default function VideoCall() {
  return <VideoUI />;
}
