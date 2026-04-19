import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Ably from "ably";
import { MessageCircle, X, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAblyTokenRequest } from "@/server/ably.functions";

const CHANNEL_NAME = "iboycloud-public-chat";
const STORAGE_KEY = "iboycloud_username";

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isMe?: boolean;
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [memberCount, setMemberCount] = useState(0);

  const clientRef = useRef<Ably.Realtime | null>(null);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Load saved username
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUsername(saved);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Connect to Ably when widget is open and username is set
  useEffect(() => {
    if (!open || !username) return;
    let cancelled = false;

    setStatus("connecting");
    const client = new Ably.Realtime({
      authCallback: async (_params, callback) => {
        try {
          const tokenRequest = await getAblyTokenRequest({ data: { name: username } });
          callback(null, tokenRequest as unknown as Ably.TokenRequest);
        } catch (err) {
          callback((err as Error)?.message ?? "auth failed", null);
        }
      },
    });

    clientRef.current = client;

    client.connection.on("connected", () => !cancelled && setStatus("connected"));
    client.connection.on("failed", () => !cancelled && setStatus("error"));

    const channel = client.channels.get(CHANNEL_NAME);
    channelRef.current = channel;

    const onMessage = (msg: Ably.Message) => {
      if (cancelled) return;
      const data = msg.data as { text: string; sender: string };
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id ?? `${msg.timestamp}-${Math.random()}`,
          sender: data.sender,
          text: data.text,
          timestamp: msg.timestamp ?? Date.now(),
          isMe: msg.clientId === username,
        },
      ]);
    };

    channel.subscribe("message", onMessage);

    // Load recent history
    channel
      .history({ limit: 30 })
      .then((page) => {
        if (cancelled) return;
        const historic = page.items
          .reverse()
          .map((m) => {
            const data = m.data as { text: string; sender: string };
            return {
              id: m.id ?? `${m.timestamp}-${Math.random()}`,
              sender: data?.sender ?? "Anon",
              text: data?.text ?? "",
              timestamp: m.timestamp ?? Date.now(),
              isMe: m.clientId === username,
            };
          });
        setMessages(historic);
      })
      .catch(() => {});

    // Presence
    channel.presence.enter().catch(() => {});
    const updatePresence = async () => {
      try {
        const members = await channel.presence.get();
        if (!cancelled) setMemberCount(members.length);
      } catch {
        // ignore
      }
    };
    updatePresence();
    channel.presence.subscribe(updatePresence);

    return () => {
      cancelled = true;
      try {
        channel.presence.leave();
        channel.unsubscribe();
        channel.presence.unsubscribe();
      } catch {
        // ignore
      }
      client.close();
      clientRef.current = null;
      channelRef.current = null;
    };
  }, [open, username]);

  const handleJoin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim().slice(0, 40);
    if (!name) return;
    localStorage.setItem(STORAGE_KEY, name);
    setUsername(name);
  }, [nameInput]);

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = draft.trim();
      if (!text || !channelRef.current || !username) return;
      channelRef.current
        .publish("message", { text, sender: username })
        .catch((err) => console.error("Publish failed:", err));
      setDraft("");
    },
    [draft, username],
  );

  return (
    <>
      {/* Floating toggle */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-elegant animate-pulse-glow"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl glass shadow-elegant sm:right-6"
            style={{ height: "min(560px, calc(100vh - 8rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">iboycloud Community</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      status === "connected"
                        ? "bg-green-500"
                        : status === "error"
                          ? "bg-destructive"
                          : "bg-muted-foreground"
                    }`}
                  />
                  {status === "connected"
                    ? "Live"
                    : status === "connecting"
                      ? "Connecting..."
                      : status === "error"
                        ? "Connection error"
                        : "Idle"}
                  {username && status === "connected" && (
                    <span className="ml-2 inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> {memberCount}
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            {!username ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleJoin}
                className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    Join the iboycloud Community
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Masukkan nama untuk mulai mengobrol secara real-time.
                  </p>
                </div>
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Nama kamu"
                  maxLength={40}
                  autoFocus
                  className="bg-white/70"
                />
                <Button type="submit" className="w-full" disabled={!nameInput.trim()}>
                  Masuk Chat
                </Button>
              </motion.form>
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
                >
                  {messages.length === 0 && (
                    <p className="py-8 text-center text-xs text-muted-foreground">
                      Belum ada pesan. Sapa komunitas duluan! 👋
                    </p>
                  )}
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-soft ${
                            m.isMe
                              ? "gradient-primary text-primary-foreground rounded-br-sm"
                              : "bg-white/80 text-foreground rounded-bl-sm border border-border/50"
                          }`}
                        >
                          {!m.isMe && (
                            <p className="mb-0.5 text-[10px] font-semibold text-primary">
                              {m.sender}
                            </p>
                          )}
                          <p className="break-words leading-relaxed">{m.text}</p>
                        </div>
                        <span className="mt-0.5 px-1 text-[10px] text-muted-foreground">
                          {formatTime(m.timestamp)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 border-t border-border/50 bg-white/40 p-3"
                >
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Tulis pesan..."
                    maxLength={500}
                    className="bg-white/80"
                    disabled={status !== "connected"}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!draft.trim() || status !== "connected"}
                    aria-label="Kirim"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
