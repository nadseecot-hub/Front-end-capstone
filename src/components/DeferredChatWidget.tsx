"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/features/ChatWidget/ChatWidget"), { ssr: false });

export default function DeferredChatWidget() {
  return <ChatWidget />;
}
