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
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const firstConversationLoadRef = useRef(true);
  const previousMessageCountRef = useRef(0);

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
  // Sort conversations
  // --------------------------------------------------
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const unreadA = Number(a.unread_count || 0);
      const unreadB = Number(b.unread_count || 0);

      // Unread conversations come first.
      if (unreadA !== unreadB) {
        return unreadB - unreadA;
      }

      const messagesA = a.messages || [];
      const messagesB = b.messages || [];

      const latestA =
        messagesA.length > 0
          ? new Date(
              messagesA[messagesA.length - 1].created_at
            ).getTime()
          : new Date(a.updated_at || a.created_at).getTime();

      const latestB =
        messagesB.length > 0
          ? new Date(
              messagesB[messagesB.length - 1].created_at
            ).getTime()
          : new Date(b.updated_at || b.created_at).getTime();

      return latestB - latestA;
    });
  }, [conversations]);

  // --------------------------------------------------
  // Load one conversation
  // --------------------------------------------------
  const loadConversation = useCallback(
    async (id, silent = false) => {
      if (!id) {
        return;
      }

      try {
        if (!silent) {
          setLoadingConversation(true);
        }

        const res = await api.get(
          `/api/chat/conversations/${id}/`
        );

        const newConversation = res.data;
        const newMessages = newConversation?.messages || [];

        // Check unread incoming messages before marking them read.
        const unreadMessages = newMessages.filter(
          (message) =>
            !message.is_read &&
            message.sender_email !== user?.email
        );

        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map((message) =>
              api.patch(
                `/api/chat/messages/${message.id}/read/`,
                {
                  is_read: true,
                }
              )
            )
          );

          // Reflect the read state immediately in the open chat.
          const readMessageIds = new Set(
            unreadMessages.map((message) => message.id)
          );

          newConversation.messages = newMessages.map(
            (message) =>
              readMessageIds.has(message.id)
                ? { ...message, is_read: true }
                : message
          );

          newConversation.unread_count = 0;

          // Update conversation list immediately.
          setConversations((current) =>
            current.map((item) =>
              item.id === Number(id)
                ? {
                    ...item,
                    unread_count: 0,
                    messages: item.messages
                      ? item.messages.map((message) =>
                          readMessageIds.has(message.id)
                            ? {
                                ...message,
                                is_read: true,
                              }
                            : message
                        )
                      : item.messages,
                  }
                : item
            )
          );
        }

        setConversation((current) => {
          if (!current) {
            return newConversation;
          }

          return {
            ...current,
            ...newConversation,
            messages: newConversation.messages || [],
          };
        });
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
    },
    [user?.email]
  );

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

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      console.warn(
        "Ignoring invalid conversation ID:",
        conversationParam
      );

      setSelectedId(null);
      setConversation(null);
      return;
    }

    firstConversationLoadRef.current = true;
    previousMessageCountRef.current = 0;

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
    const messages = conversation?.messages || [];

    if (!conversation) {
      return;
    }

    // Scroll to the bottom only once when opening
    // a conversation.
    if (firstConversationLoadRef.current) {
      firstConversationLoadRef.current = false;
      previousMessageCountRef.current = messages.length;

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "auto",
        });
      });

      return;
    }

    const previousCount = previousMessageCountRef.current;
    const currentCount = messages.length;

    // Nothing new arrived.
    if (currentCount <= previousCount) {
      previousMessageCountRef.current = currentCount;
      return;
    }

    // Find messages added since the previous render.
    const newMessages = messages.slice(previousCount);

    // Only automatically follow incoming messages.
    const hasIncomingMessage = newMessages.some(
      (message) => message.sender_email !== user?.email
    );

    const container = messagesContainerRef.current;

    if (container && hasIncomingMessage) {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      // Only follow the message if the user was
      // already close to the bottom.
      if (distanceFromBottom < 150) {
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
          });
        });
      }
    }

    previousMessageCountRef.current = currentCount;
  }, [conversation, user?.email]);

  // --------------------------------------------------
  // Select conversation
  // --------------------------------------------------
  const selectConversation = (id) => {
    if (!id) {
      return;
    }

    setError("");

    setSearchParams({
      conversation: String(id),
    });
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

    // Prevent messaging yourself.
    const isRenter =
      conversation?.renter_email === user?.email;

    const otherPersonEmail = isRenter
      ? conversation?.owner_email
      : conversation?.renter_email;

    if (
      !otherPersonEmail ||
      otherPersonEmail === user?.email
    ) {
      setError("You cannot send a message to yourself.");
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
        if (!current) {
          return current;
        }

        return {
          ...current,
          messages: [
            ...(current.messages || []),
            res.data,
          ],
        };
      });

      // Clear after successful send.
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
    if (!conversation) {
      return "";
    }

    if (conversation.space_title) {
      return conversation.space_title;
    }

    if (conversation.space?.title) {
      return conversation.space.title;
    }

    return "Conversation";
  }, [conversation]);

  const otherPerson = useMemo(() => {
    if (!conversation || !user) {
      return "User";
    }

    const isRenter =
      conversation.renter_email === user.email;

    return isRenter
      ? conversation.owner_name ||
          conversation.owner_email ||
          "Owner"
      : conversation.renter_name ||
          conversation.renter_email ||
          "Renter";
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
                {sortedConversations.map((item) => {
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

                  const itemMessages = item.messages || [];

                  const lastMessage =
                    itemMessages[itemMessages.length - 1];

                  const unreadCount = Number(
                    item.unread_count || 0
                  );

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        selectConversation(item.id)
                      }
                      className={`w-full border-b border-gray-100 px-5 py-4 text-left transition ${
                        active
                          ? "bg-[#eef4f1]"
                          : unreadCount > 0
                            ? "bg-[#fffaf0] hover:bg-[#fff6df]"
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

                          {lastMessage?.content && (
                            <p
                              className={`mt-1 truncate text-xs ${
                                unreadCount > 0
                                  ? "font-semibold text-[#155c3a]"
                                  : "text-gray-400"
                              }`}
                            >
                              {lastMessage.content}
                            </p>
                          )}
                        </div>

                        {unreadCount > 0 && (
                          <div className="flex shrink-0 items-center gap-1.5">
                            <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                              {unreadCount > 99
                                ? "99+"
                                : unreadCount}{" "}
                              NEW
                            </span>
                          </div>
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
                    Choose a conversation from the left to start messaging.
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
                <div
                  ref={messagesContainerRef}
                  className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6"
                >
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
                              : !message.is_read
                                ? "rounded-bl-md border border-[#e0b84b] bg-[#fff8df] text-gray-800 shadow-sm"
                                : "rounded-bl-md bg-[#f3f3ef] text-gray-800"
                          }`}
                        >
                          {!mine && !message.is_read && (
                            <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#a87800]">
                              New message
                            </div>
                          )}

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