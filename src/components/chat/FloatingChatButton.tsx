import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const FloatingChatButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChatClick = () => {
    if (user) {
      navigate("/chat");
    } else {
      navigate("/auth");
    }
  };

  return (
    <Button
      onClick={handleChatClick}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-strong hover:shadow-medium transition-all duration-300 hover:scale-110 z-50"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};
