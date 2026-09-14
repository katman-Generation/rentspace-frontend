import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";
import { useAuth } from "../context/useAuth";

export default function Messages() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [conversation, setConversation] = useState(null);

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingConversation, setLoadingConversation] = useState(false);

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --------------------------------------------------
  // Load conversation list
  // --------------------------------------------------
  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get("/api/chat/conversations/");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setConversations(data);

      return data;
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Unable to load your conversations.");
      return [];
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  // --------------------------------------------------
  // Load one conversation
  // --------------------------------------------------
  const loadConversation = useCallback(async (id, silent = false) => {
    // IMPORTANT:
    // Never make an API request with undefined/null/empty ID.
    if (!id) {
      return;
    }

    try {
      if (!silent) {
        setLoadingConversation(true);
      }

      const res = await api.get(`/api/chat/conversations/${id}/`);

      setConversation(res.data);

      // Mark unread messages as read
      const messages = res.data?.messages || [];

      const unreadMessages = messages.filter(
        (message) =>
          !message.is_read &&
          message.sender_email !== user?.email
      );

      await Promise.all(
        unreadMessages.map((message) =>
          api.patch(`/api/chat/messages/${message.id}/read/`, {
            is_read: true,
          })
        )
      );

      if (unreadMessages.length > 0) {
        setConversations((current) =>
          current.map((item) =>
            item.id === Number(id)
              ? {
                  ...item,
                  last_message: item.last_message
                    ? {
                        ...item.last_message,
                        is_read: true,
                      }
                    : item.last_message,
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);

      if (!silent) {
        setError("Unable to load this conversation.");
      }
    } finally {
      if (!silent) {
        setLoadingConversation(false);
      }
    }
  }, [user?.email]);

  // --------------------------------------------------
  // Initial load
  // --------------------------------------------------
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // --------------------------------------------------
  // Select conversation from URL
  // --------------------------------------------------
  useEffect(() => {
    const conversationParam = searchParams.get("conversation");

    if (!conversationParam) {
      setSelectedId(null);
      setConversation(null);
      return;
    }

    const parsedId = Number(conversationParam);

    // Reject invalid values such as:
    // undefined
    // null
    // ""
    // abc
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      console.warn(
        "Ignoring invalid conversation ID:",
        conversationParam
      );

      setSelectedId(null);
      setConversation(null);
      return;
    }

    setSelectedId(parsedId);
  }, [searchParams]);

  // --------------------------------------------------
  // Load selected conversation
  // --------------------------------------------------
  useEffect(() => {
    if (!selectedId) {
      return;
    }

    loadConversation(selectedId);
  }, [selectedId, loadConversation]);

  // --------------------------------------------------
  // Poll selected conversation
  // --------------------------------------------------
  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const interval = setInterval(() => {
      loadConversation(selectedId, true);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedId, loadConversation]);

  // --------------------------------------------------
  // Auto-scroll messages
  // --------------------------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversation?.messages]);

  // --------------------------------------------------
  // Select conversation
  // --------------------------------------------------
  const selectConversation = (id) => {
    if (!id) return;

    setError("");
    setSearchParams({ conversation: String(id) });
  };

  // --------------------------------------------------
  // Send message
  // --------------------------------------------------
  const sendMessage = async (e) => {
    e.preventDefault();

    const content = messageText.trim();

    if (!content || !selectedId || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const res = await api.post(
        `/api/chat/conversations/${selectedId}/messages/`,
        {
          content,
        }
      );

      // Add the new message immediately.
      setConversation((current) => {
        if (!current) return current;

        return {
          ...current,
          messages: [
            ...(current.messages || []),
            res.data,
          ],
        };
      });

      // Clear ONLY after successful send.
      setMessageText("");

      // Keep focus in the input.
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });

      // Refresh conversation list so preview/order updates.
      await loadConversations();
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(
        err?.response?.data?.content?.[0] ||
          "Unable to send your message."
      );
    } finally {
      setSending(false);
    }
  };

  // --------------------------------------------------
  // Current conversation information
  // --------------------------------------------------
  const conversationTitle = useMemo(() => {
    if (!conversation) return "";

    if (conversation.space_title) {
      return conversation.space_title;
    }

    if (conversation.space?.title) {
      return conversation.space.title;
    }

    return "Conversation";
  }, [conversation]);

  const otherPerson = useMemo(() => {
    if (!conversation || !user) return "User";

    const isRenter =
      conversation.renter_email === user.email;

    return isRenter
      ? conversation.owner_name || conversation.owner_email || "Owner"
      : conversation.renter_name || conversation.renter_email || "Renter";
  }, [conversation, user]);

  return (
    <div className="min-h-screen bg-[#f8f4e9]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#155c3a]">
            RentSpace
          </p>

          <h1 className="text-3xl font-bold text-[#0d3b2e]">
            Messages
          </h1>

          <p className="mt-2 text-gray-500">
            Talk directly with renters and space owners.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid min-h-[600px] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm md:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <aside className="border-b border-gray-100 md:border-b-0 md:border-r">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-[#0d3b2e]">
                Conversations
              </h2>
            </div>

            {loadingConversations ? (
              <div className="p-5 text-sm text-gray-400">
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mb-3 text-3xl">💬</div>

                <p className="font-semibold text-gray-700">
                  No conversations yet
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Message a space owner to start a conversation.
                </p>
              </div>
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                {conversations.map((item) => {
                  const active = item.id === selectedId;

                  const title =
                    item.space_title ||
                    item.space?.title ||
                    "Space";

                  const person =
                    item.renter_email === user?.email
                      ? item.owner_name ||
                        item.owner_email ||
                        "Owner"
                      : item.renter_name ||
                        item.renter_email ||
                        "Renter";

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectConversation(item.id)}
                      className={`w-full border-b border-gray-100 px-5 py-4 text-left transition ${
                        active
                          ? "bg-[#eef4f1]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#0d3b2e]">
                            {title}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {person}
                          </p>

                          {item.last_message?.content && (
                            <p className="mt-1 truncate text-xs text-gray-400">
                              {item.last_message.content}
                            </p>
                          )}
                        </div>

                        {!item.last_message?.is_read &&
                          item.last_message?.sender_email !==
                            user?.email && (
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#e0b84b]" />
                          )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Chat */}
          <section className="flex min-h-[600px] flex-col">
            {!selectedId ? (
              <div className="flex flex-1 items-center justify-center p-8 text-center">
                <div>
                  <div className="mb-4 text-5xl">💬</div>

                  <h2 className="text-xl font-bold text-[#0d3b2e]">
                    Select a conversation
                  </h2>

                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Choose a conversation from the left to start
                    messaging.
                  </p>
                </div>
              </div>
            ) : loadingConversation && !conversation ? (
              <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
                Loading conversation...
              </div>
            ) : conversation ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="font-bold text-[#0d3b2e]">
                      {conversationTitle}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {otherPerson}
                    </p>
                  </div>

                  {conversation.space_id && (
                    <Link
                      to={`/space/${conversation.space_id}`}
                      className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-[#0d3b2e] transition hover:bg-gray-50"
                    >
                      View space
                    </Link>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
                  {(conversation.messages || []).map((message) => {
                    const mine =
                      message.sender_email === user?.email;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          mine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            mine
                              ? "rounded-br-md bg-[#155c3a] text-white"
                              : "rounded-bl-md bg-[#f3f3ef] text-gray-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm">
                            {message.content}
                          </p>

                          <p
                            className={`mt-1 text-[10px] ${
                              mine
                                ? "text-white/60"
                                : "text-gray-400"
                            }`}
                          >
                            {new Date(
                              message.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form
                  onSubmit={sendMessage}
                  className="border-t border-gray-100 p-4 sm:p-5"
                >
                  <div className="flex items-end gap-3">
                    <textarea
                      ref={inputRef}
                      value={messageText}
                      onChange={(e) =>
                        setMessageText(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey
                        ) {
                          e.preventDefault();
                          sendMessage(e);
                        }
                      }}
                      rows={2}
                      placeholder="Write a message..."
                      className="min-h-[52px] flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#155c3a] focus:ring-2 focus:ring-[#155c3a]/10"
                    />

                    <button
                      type="submit"
                      disabled={
                        sending ||
                        !messageText.trim()
                      }
                      className="rounded-2xl bg-[#155c3a] px-5 py-3 font-semibold text-white transition hover:bg-[#0d3f29] disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Press Enter to send · Shift + Enter for a new line
                  </p>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
                Conversation not found.
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}