import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom);
      subscribeToMessages(activeRoom);
    }
  }, [activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRooms = async () => {
    const { data } = await supabase
      .from("chat_participants")
      .select(`
        room_id,
        chat_rooms (
          id,
          name,
          type
        )
      `)
      .eq("user_id", user?.id);

    if (data) {
      setRooms(data.map((p: any) => p.chat_rooms));
    }
  };

  const loadMessages = async (roomId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select(`
        id,
        content,
        sender_id,
        created_at
      `)
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (data) {
      const messagesWithProfiles = await Promise.all(
        data.map(async (msg) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("user_id", msg.sender_id)
            .single();
          return { ...msg, sender_profile: profile };
        })
      );
      setMessages(messagesWithProfiles);
    }
  };

  const subscribeToMessages = (roomId: string) => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: messageData } = await supabase
            .from("chat_messages")
            .select("id, content, sender_id, created_at")
            .eq("id", payload.new.id)
            .single();

          if (messageData) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("user_id", messageData.sender_id)
              .single();
            setMessages((prev) => [...prev, { ...messageData, sender_profile: profile }]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeRoom) return;

    const { error } = await supabase.from("chat_messages").insert({
      room_id: activeRoom,
      sender_id: user?.id,
      content: newMessage,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 mt-16">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          <Card className="col-span-3 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <h2 className="font-semibold">Chats</h2>
            </div>
            <ScrollArea className="h-full">
              {rooms.map((room) => (
                <Button
                  key={room.id}
                  variant={activeRoom === room.id ? "secondary" : "ghost"}
                  className="w-full justify-start mb-2"
                  onClick={() => setActiveRoom(room.id)}
                >
                  {room.name}
                </Button>
              ))}
            </ScrollArea>
          </Card>

          <Card className="col-span-9 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender_id === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender_id === user?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.sender_profile?.full_name || "Unknown"}
                    </p>
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </ScrollArea>

            <div className="p-4 border-t flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
