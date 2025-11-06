import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CustomAuthProvider } from "@/hooks/useCustomAuth";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/animations/Preloader";
import { useLenis } from "@/hooks/useLenis";
import { useEffect } from "react";
import { updateSEO, defaultSEO } from "@/lib/seo";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
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

const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Initialize Lenis smooth scrolling
  useLenis();
  
  // Update SEO on route change
  useEffect(() => {
    updateSEO(defaultSEO);
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
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
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ovaboe-theme">
      <AuthProvider>
        <CustomAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Preloader />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </CustomAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
