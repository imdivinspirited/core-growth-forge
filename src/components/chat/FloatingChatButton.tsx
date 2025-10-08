import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Don't show on chat page or auth page
  if (location.pathname === "/chat" || location.pathname === "/auth") {
    return null;
  }

  const handleClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/chat");
  };

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-strong hover:shadow-strong hover:scale-110 transition-all duration-300 bg-gradient-to-br from-primary to-accent z-50"
      aria-label="Open chat"
    >
      {isHovered ? (
        <MessageCircle className="h-6 w-6 animate-pulse" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </Button>
  );
};
