import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, ArrowLeft, Video, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

interface Conversation {
  id: string;
  mentor_id: string;
  student_id: string;
  last_message_at: string | null;
  other_name?: string;
  other_initials?: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sent_at: string;
}

const ChatPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profile) return;
    loadConversations();
  }, [profile]);

  const loadConversations = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (data) {
      // Fetch other participant names
      const convs = await Promise.all(
        data.map(async (c) => {
          const otherId = c.mentor_id === profile.id ? c.student_id : c.mentor_id;
          const { data: otherProfile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", otherId)
            .maybeSingle();
          const otherName = otherProfile?.name || "User";
          return {
            ...c,
            other_name: otherName,
            other_initials: otherName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
          };
        })
      );
      setConversations(convs);
    }
  };

  useEffect(() => {
    if (!activeConv) return;
    loadMessages(activeConv);

    const channel = supabase
      .channel(`messages-${activeConv}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeConv}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("sent_at", { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv || !profile) return;
    setSending(true);
    await supabase.from("messages").insert({
      conversation_id: activeConv,
      sender_id: profile.id,
      content: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  const deleteConversation = async (convId: string) => {
    if (!confirm("Delete this conversation and all messages? This cannot be undone.")) return;
    // Delete messages first, then conversation
    await supabase.from("messages").delete().eq("conversation_id", convId);
    await supabase.from("conversations").delete().eq("id", convId);
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConv === convId) {
      setActiveConv(null);
      setMessages([]);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeConvData = conversations.find((c) => c.id === activeConv);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 h-screen flex">
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-border/50 flex flex-col ${activeConv ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-border/50">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" /> Messages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No conversations yet.</p>
                <p className="mt-1">Book a session to start chatting!</p>
              </div>
            ) : (
              conversations.map((c) => (
                <div key={c.id} className="flex items-center group">
                  <button
                    onClick={() => setActiveConv(c.id)}
                    className={`flex-1 flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeConv === c.id ? "bg-primary/10" : "hover:bg-secondary"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {c.other_initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{c.other_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.last_message_at
                          ? new Date(c.last_message_at).toLocaleDateString()
                          : "No messages yet"}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
                    className="p-2 mr-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${!activeConv ? "hidden md:flex" : "flex"}`}>
          {activeConv && activeConvData ? (
            <>
              <div className="p-4 border-b border-border/50 flex items-center gap-3">
                <button onClick={() => setActiveConv(null)} className="md:hidden text-muted-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {activeConvData.other_initials}
                </div>
                <span className="font-medium text-sm flex-1">{activeConvData.other_name}</span>
                <button
                  onClick={() => deleteConversation(activeConv)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const roomId = `localmentor-${activeConv}`;
                    window.open(`https://meet.jit.si/${roomId}`, "_blank", "noopener,noreferrer");
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                  title="Start Video Call"
                >
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">Video Call</span>
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.sender_id === profile?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMine
                            ? "gradient-accent text-accent-foreground rounded-br-md"
                            : "bg-secondary text-secondary-foreground rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                        <div className={`text-[10px] mt-1 ${isMine ? "text-accent-foreground/60" : "text-muted-foreground"}`}>
                          {new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                  />
                  <motion.button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 rounded-lg gradient-accent text-accent-foreground disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Choose from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
