import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";
import { useAuth } from "../context/useAuth";

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(
    searchParams.get("conversation") || null
  );

  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const getConversations = async () => {
    try {
      const res = await api.get("/api/chat/conversations/");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setConversations(data);

      return data;
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("We couldn't load your messages.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      setLoadingConversation(true);

      const res = await api.get(
        `/api/chat/conversations/${conversationId}/`
      );

      setConversation(res.data);

      // Mark unread messages as read.
      const messages = res.data?.messages || [];

      const unreadMessages = messages.filter(
        (item) =>
          !item.is_read &&
          item.sender_email &&
          item.sender_email !== user?.email
      );

      await Promise.all(
        unreadMessages.map((item) =>
          api.patch(`/api/chat/messages/${item.id}/read/`, {
            is_read: true,
          })
        )
      );

      // Refresh conversation list so previews/unread state stay current.
      await getConversations();
    } catch (err) {
      console.error("Failed to load conversation:", err);
      setError("We couldn't load this conversation.");
    } finally {
      setLoadingConversation(false);
    }
  }, [user?.email]);

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadConversation(selectedId);
    }
  }, [selectedId, loadConversation]);

  // Lightweight polling for new messages.
  useEffect(() => {
    if (!selectedId) return;

    const interval = setInterval(() => {
      loadConversation(selectedId);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedId, loadConversation]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const content = message.trim();

    if (!content || !selectedId || sending) return;

    try {
      setSending(true);
      setError("");

      await api.post(
        `/api/chat/conversations/${selectedId}/messages/`,
        {
          content,
        }
      );

      setMessage("");

      await loadConversation(selectedId);
    } catch (err) {
      console.error("Failed to send message:", err);

      const backendError = err?.response?.data;

      setError(
        backendError?.content?.[0] ||
          "We couldn't send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (item) => String(item.id) === String(selectedId)
      ),
    [conversations, selectedId]
  );

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="min-h-[70vh] bg-[#f8f4e9] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e5ad35]/20 text-3xl">
              💬
            </div>

            <h1 className="mt-6 text-3xl font-bold text-[#1d2923]">
              Sign in to view your messages
            </h1>

            <p className="mt-3 text-gray-500">
              Log in to communicate with space owners and renters.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex rounded-full bg-[#155c3a] px-6 py-3 font-semibold text-white hover:bg-[#0d3f29]"
            >
              Log in
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4e9]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
            RentSpace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#1d2923] sm:text-4xl">
            Messages
          </h1>

          <p className="mt-2 text-gray-500">
            Communicate directly with people about their spaces.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid min-h-[600px] overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl lg:grid-cols-[340px_1fr]">

          {/* CONVERSATION LIST */}
          <aside className="border-b border-gray-100 lg:border-b-0 lg:border-r">
            <div className="border-b border-gray-100 px-5 py-4">
              <p className="text-sm font-semibold text-gray-500">
                Conversations
              </p>
            </div>

            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl bg-gray-100 p-5"
                  >
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="mt-3 h-3 w-1/2 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="text-3xl">💬</div>

                <h2 className="mt-4 font-bold text-[#1d2923]">
                  No conversations yet
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  When you message a space owner, your conversation will
                  appear here.
                </p>

                <Link
                  to="/"
                  className="mt-5 inline-flex rounded-full bg-[#155c3a] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Explore spaces
                </Link>
              </div>
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                {conversations.map((item) => {
                  const isActive =
                    String(item.id) === String(selectedId);

                  const messages = item.messages || [];
                  const lastMessage =
                    messages.length > 0
                      ? messages[messages.length - 1]
                      : null;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full border-b border-gray-100 px-5 py-4 text-left transition ${
                        isActive
                          ? "bg-[#eef4f1]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#1d2923]">
                            {item.space_title || "RentSpace listing"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {item.owner_name
                              ? `Owner: ${item.owner_name}`
                              : ""}
                          </p>
                        </div>

                        {lastMessage && !lastMessage.is_read && (
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#e5ad35]" />
                        )}
                      </div>

                      {lastMessage && (
                        <p className="mt-2 truncate text-sm text-gray-500">
                          {lastMessage.content}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* CHAT */}
          <section className="flex min-h-[600px] flex-col">
            {!selectedId ? (
              <div className="flex flex-1 items-center justify-center px-6 text-center">
                <div>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e5ad35]/20 text-3xl">
                    💬
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-[#1d2923]">
                    Select a conversation
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Choose a conversation from the left to start messaging.
                  </p>
                </div>
              </div>
            ) : loadingConversation && !conversation ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#155c3a]/20 border-t-[#155c3a]" />
                  <p className="mt-4 text-sm text-gray-500">
                    Loading conversation...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* CHAT HEADER */}
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#a85f3f]">
                    Conversation
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#1d2923]">
                    {conversation?.space_title ||
                      selectedConversation?.space_title ||
                      "RentSpace listing"}
                  </h2>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 space-y-4 overflow-y-auto bg-[#faf9f5] px-5 py-6 sm:px-7">
                  {(conversation?.messages || []).length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <p className="font-semibold text-[#1d2923]">
                          Start the conversation
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Ask a question about this space.
                        </p>
                      </div>
                    </div>
                  ) : (
                    conversation.messages.map((item) => {
                      const mine =
                        item.sender_email === user.email;

                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            mine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              mine
                                ? "rounded-br-md bg-[#155c3a] text-white"
                                : "rounded-bl-md bg-white text-[#1d2923] shadow-sm"
                            }`}
                          >
                            {!mine && (
                              <p className="mb-1 text-xs font-semibold text-[#a85f3f]">
                                {item.sender_name || "User"}
                              </p>
                            )}

                            <p className="whitespace-pre-wrap text-sm leading-6">
                              {item.content}
                            </p>

                            <p
                              className={`mt-1 text-[10px] ${
                                mine
                                  ? "text-white/60"
                                  : "text-gray-400"
                              }`}
                            >
                              {item.created_at
                                ? new Date(
                                    item.created_at
                                  ).toLocaleString()
                                : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* COMPOSER */}
                <form
                  onSubmit={sendMessage}
                  className="border-t border-gray-100 bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a message..."
                      rows={2}
                      className="min-w-0 flex-1 resize-none rounded-2xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-sm outline-none transition focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          e.currentTarget.form?.requestSubmit();
                        }
                      }}
                    />

                    <button
                      type="submit"
                      disabled={!message.trim() || sending}
                      className="self-end rounded-2xl bg-[#155c3a] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0d3f29] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? "..." : "Send"}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-gray-400">
                    Press Enter to send. Shift + Enter for a new line.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}