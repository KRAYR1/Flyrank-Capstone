"use client";

/**
 * components/Chat.tsx
 *
 * The ThinkTank all-rounder study assistant chat UI.
 *
 * Handles:
 * - streamed text rendering via useChat's message parts
 * - a thinking indicator that hands off to the first token (no flicker)
 * - a stop button that leaves the partial message intact and re-enables
 *   input immediately
 * - auto-scroll that pins to bottom only while the user hasn't scrolled
 *   up, with a "jump to latest" affordance when they have
 * - mobile-friendly input (fixed to viewport bottom, safe-area aware)
 */
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Streamdown } from "streamdown";

const SCROLL_BOTTOM_THRESHOLD_PX = 48;

export default function Chat() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pinnedToBottom, setPinnedToBottom] = useState(true);

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";
  const isBusy = isStreaming || isSubmitted;

  // Track whether the user is at the bottom of the scroll container.
  // Only auto-scroll while they haven't deliberately scrolled up —
  // this must be re-checked continuously during streaming, not just
  // once after a message finishes.
  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    setPinnedToBottom(distanceFromBottom < SCROLL_BOTTOM_THRESHOLD_PX);
  }

  function scrollToBottom(behavior: ScrollBehavior = "smooth") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    setPinnedToBottom(true);
  }

  // Re-run on every messages update (including in-flight streamed
  // deltas) so the pin behavior tracks tokens arriving, not just
  // message-count changes.
  useEffect(() => {
    if (pinnedToBottom) {
      scrollToBottom("auto");
    }
  }, [messages, pinnedToBottom]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput("");
    setPinnedToBottom(true);
  }

  return (
    <div className="chat-root">
      <div
        className="chat-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 && (
          <div className="chat-empty">
            <p className="chat-empty-title">Ask me anything</p>
            <p className="chat-empty-body">
              Coursework questions, explanations, planning your study
              week — I&apos;m here for all of it.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "message message-user"
                : "message message-assistant"
            }
          >
            <div className="message-bubble">
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <Streamdown key={i}>{part.text}</Streamdown>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}

        {/* Thinking indicator: shown only after submit, before the
            first token arrives. It occupies the same visual slot the
            first streamed text will appear in, so the transition from
            indicator to text reads as a handoff, not a swap. */}
        {isSubmitted && (
          <div className="message message-assistant">
            <div className="message-bubble message-thinking">
              <span className="thinking-dot" />
              <span className="thinking-dot" />
              <span className="thinking-dot" />
            </div>
          </div>
        )}
      </div>

      {!pinnedToBottom && (
        <button
          type="button"
          className="jump-to-latest"
          onClick={() => scrollToBottom()}
        >
          Jump to latest ↓
        </button>
      )}

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask a question..."
          rows={1}
          aria-label="Message"
        />
        {isBusy ? (
          <button type="button" className="chat-stop-btn" onClick={stop}>
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!input.trim()}
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
