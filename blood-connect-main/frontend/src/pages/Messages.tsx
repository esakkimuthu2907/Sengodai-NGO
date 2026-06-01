import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft, MessageSquare, ShieldAlert } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/store/auth";
import api from "@/lib/axios";
import { getSocket } from "@/hooks/useSocket";
import { toast } from "@/hooks/use-toast";

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
}

interface Message {
  _id: string;
  sender: UserInfo | string;
  receiver: UserInfo | string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Thread {
  user: UserInfo;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

const Messages = () => {
  const auth = useAuth();
  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.role === "admin";

  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadUserId, setActiveThreadUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch threads (Admin) or full chat history (Volunteer)
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/messages");
      if (res.data.success) {
        if (isAdmin) {
          setThreads(res.data.data);
          // Auto select first thread if available and none selected yet
          if (res.data.data.length > 0 && !activeThreadUserId) {
            setActiveThreadUserId(res.data.data[0].user._id);
          }
        } else {
          setMessages(res.data.data);
        }
      }
    } catch (err: any) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch thread messages for a specific user (Admin)
  const fetchThreadMessages = async (userId: string) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      if (res.data.success) {
        setMessages(res.data.data);
        // Clear unread count locally for this user
        setThreads(prev => prev.map(t => t.user._id === userId ? { ...t, unreadCount: 0 } : t));
      }
    } catch (err) {
      console.error("Failed to fetch user thread", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && activeThreadUserId) {
      fetchThreadMessages(activeThreadUserId);
    }
  }, [activeThreadUserId, isAdmin]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket.io listener
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const handleNewMessage = (msg: Message) => {
      // Resolve IDs for check
      const msgSenderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      const msgReceiverId = typeof msg.receiver === "object" ? msg.receiver._id : msg.receiver;

      if (isAdmin) {
        // If message is between currently active user and admin
        if (activeThreadUserId && (msgSenderId === activeThreadUserId || msgReceiverId === activeThreadUserId)) {
          setMessages(prev => [...prev, msg]);
        }
        // Refresh thread summary list
        fetchInitialData();
      } else {
        // Volunteer: if message belongs to them
        if (msgSenderId === currentUser?.id || msgReceiverId === currentUser?.id) {
          setMessages(prev => [...prev, msg]);
        }
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [activeThreadUserId, isAdmin, currentUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const payload: any = { content: newMessage };
      if (isAdmin) {
        if (!activeThreadUserId) {
          toast({ title: "Please select a user to message", variant: "destructive" });
          return;
        }
        payload.receiverId = activeThreadUserId;
      }

      const res = await api.post("/messages", payload);
      if (res.data.success) {
        setNewMessage("");
        // Optimistically add to state (socket will also broadcast, but this guarantees instant rendering)
        const exists = messages.some(m => m._id === res.data.data._id);
        if (!exists) {
          setMessages(prev => [...prev, res.data.data]);
        }
      }
    } catch (err: any) {
      toast({ title: "Failed to send message", description: err.response?.data?.message || "Error occurred", variant: "destructive" });
    }
  };

  const getInitials = (user: UserInfo) => {
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "V";
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const selectedThread = threads.find(t => t.user._id === activeThreadUserId);

  return (
    <AppLayout title="Messages">
      <Card className="h-[calc(100vh-12rem)] flex overflow-hidden border-0 shadow-card bg-background">
        {/* Admin Split View: User List Panel */}
        {isAdmin && (
          <div className={`w-full lg:w-80 border-r border-border flex flex-col ${
            !showMobileList ? "hidden lg:flex" : "flex"
          }`}>
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Conversations</h3>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {threads.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                  No active chats yet.
                </div>
              ) : (
                threads.map(t => (
                  <div
                    key={t.user._id}
                    onClick={() => {
                      setActiveThreadUserId(t.user._id);
                      setShowMobileList(false);
                    }}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/40 transition-colors ${
                      activeThreadUserId === t.user._id ? "bg-secondary" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(t.user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-sm truncate">{t.user.firstName} {t.user.lastName}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(t.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{t.lastMessage}</p>
                    </div>
                    {t.unreadCount > 0 && (
                      <span className="h-5 min-w-5 px-1 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold">
                        {t.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Window Panel */}
        <div className={`flex-1 flex flex-col bg-secondary/10 ${
          isAdmin && showMobileList ? "hidden lg:flex" : "flex"
        }`}>
          {/* Header */}
          <div className="bg-background border-b border-border p-4 flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowMobileList(true)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {isAdmin ? (
              selectedThread ? (
                <>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(selectedThread.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{selectedThread.user.firstName} {selectedThread.user.lastName}</div>
                    <div className="text-xs text-muted-foreground">{selectedThread.user.email} · {selectedThread.user.phone || "No phone"}</div>
                  </div>
                </>
              ) : (
                <div className="text-sm font-semibold">Select a chat</div>
              )
            ) : (
              <>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">A</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">System Administrator</div>
                  <div className="text-xs text-success flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-success inline-block animate-pulse" /> Support Hotline
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading message history...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground max-w-sm mx-auto">
                <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
                <p className="font-semibold">Start the Conversation!</p>
                <p className="text-xs mt-1">Send a message to coordinate blood requests, donation drives, or system assistance.</p>
              </div>
            ) : (
              messages.map(m => {
                const isMe = (typeof m.sender === "object" ? m.sender._id : m.sender) === currentUser?.id;
                return (
                  <div
                    key={m._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      isMe 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-background text-foreground rounded-tl-none border border-border"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      <div className={`text-[9px] mt-1 text-right ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {(isAdmin && !activeThreadUserId) ? (
            <div className="p-4 bg-background border-t border-border flex items-center justify-center text-sm text-muted-foreground">
              <ShieldAlert className="h-4 w-4 mr-2" /> Please select a user thread to send messages.
            </div>
          ) : (
            <form onSubmit={handleSend} className="p-4 bg-background border-t border-border flex gap-2">
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-secondary/20 border-0 focus-visible:ring-primary"
              />
              <Button type="submit" size="icon" className="shrink-0 bg-primary hover:bg-primary/95">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </Card>
    </AppLayout>
  );
};

export default Messages;
