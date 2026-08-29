"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(() => import("@/features/ChatWidget/ChatWidget"), { ssr: false });

export default function DeferredChatWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setReady(true);
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
      const id = idleWindow.requestIdleCallback(load, { timeout: 2500 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(load, 1200);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <ChatWidget /> : null;
}
