"use client";

import React, { useEffect, useState } from "react";
import { useChatViewModel } from "./useChatViewModel";

/* ==========================================================================
   ChatWidget — floating chat interface for tutor finder support
   
   Features:
   - Floating button in bottom-right corner
   - Expandable/collapsible chat window
   - Streaming AI responses with thinking indicator
   - Stop button to cancel generation
   - Auto-scroll with user scroll detection
   - Quick action buttons for common questions
   - Mobile-friendly responsive design
   ========================================================================== */

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

const StopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const MinimizeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
  </svg>
);

const ThinkingDots = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    <span className="w-2 h-2 bg-teal rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
    <span className="w-2 h-2 bg-teal rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
    <span className="w-2 h-2 bg-teal rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
  </div>
);

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
    quickActions,
    messagesEndRef,
    scrollContainerRef,
    handleScroll,
  } = useChatViewModel();

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, messagesEndRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-teal text-white rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-140px)] bg-surface rounded-card shadow-2xl flex flex-col overflow-hidden border border-border animate-fade-in"
          role="dialog"
          aria-label="Chat assistant"
        >
          {/* Header */}
          <div className="bg-teal text-white px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">TutorFinder Support</h2>
              <p className="text-sm text-white/80">Ask me anything about finding tutors</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Minimize chat"
            >
              <MinimizeIcon />
            </button>
          </div>

          {/* Messages area */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-parchment"
          >
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-ink/70 mb-4">Hello! How can I help you today?</p>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      className="w-full text-left px-3 py-2 bg-surface border border-border rounded-input text-sm text-ink hover:border-teal hover:text-teal transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-card ${
                      message.role === "user"
                        ? "bg-teal text-white rounded-br-sm"
                        : "bg-surface border border-border text-ink rounded-bl-sm"
                    }`}
                  >
                    {message.content === "" && message.role === "assistant" ? (
                      <ThinkingDots />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {error && (
              <div className="text-center py-2">
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={clearMessages}
                  className="text-teal text-sm underline mt-1"
                >
                  Try again
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-3 bg-surface border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-border rounded-pill text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal disabled:bg-ink/5 disabled:cursor-not-allowed"
              />
              {isLoading ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label="Stop generating"
                >
                  <StopIcon />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-teal text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
