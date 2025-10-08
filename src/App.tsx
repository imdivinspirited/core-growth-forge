import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import SkillSpace from "./pages/SkillSpace";
import ThinkSpace from "./pages/ThinkSpace";
import Workshop from "./pages/Workshop";
import Settings from "./pages/Settings";
import BlogWriter from "./components/thinkspace/BlogWriter";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Tourism from "./pages/Tourism";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingChatButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/skillspace" element={<ProtectedRoute><SkillSpace /></ProtectedRoute>} />
            <Route path="/thinkspace" element={<ProtectedRoute><ThinkSpace /></ProtectedRoute>} />
            <Route path="/thinkspace/write" element={<ProtectedRoute><BlogWriter /></ProtectedRoute>} />
            <Route path="/workshop" element={<ProtectedRoute><Workshop /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/tourism" element={<ProtectedRoute><Tourism /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
