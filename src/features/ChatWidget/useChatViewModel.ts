"use client";

import { useCallback, useRef, useState } from "react";
import {
  QUICK_ACTIONS,
  type ChatMessage,
  type ChatState,
} from "./ChatModel";

/* ==========================================================================
   useChatViewModel — state and logic for the chat widget
   
   Manages:
   - Message history and loading state
   - Auto-scroll behavior with user scroll detection
   - Abort controller for stop button functionality
   - Quick action buttons
   ========================================================================== */

export const useChatViewModel = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [shouldAutoScroll]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    abortControllerRef.current = new AbortController();

    const assistantMessageId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...state.messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                accumulatedContent += content;
                setState((prev) => ({
                  ...prev,
                  messages: prev.messages.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: accumulatedContent }
                      : m
                  ),
                }));
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        messages: prev.messages.filter((m) => m.id !== assistantMessageId),
      }));
    }
  }, [state.messages, state.isLoading]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState({ messages: [], isLoading: false, error: null });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    stopGeneration,
    clearMessages,
    quickActions: QUICK_ACTIONS,
    messagesEndRef,
    scrollContainerRef,
    handleScroll,
    scrollToBottom,
  };
};
