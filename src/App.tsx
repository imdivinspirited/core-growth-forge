import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CustomAuthProvider } from "@/hooks/useCustomAuth";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { DynamicExperienceProvider } from "@/context/DynamicExperienceContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/animations/Preloader";
import GlobalNavigation from "@/components/layout/GlobalNavigation";
import { useEffect } from "react";
import { updateSEO, defaultSEO } from "@/lib/seo";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import AuraLearn from "./pages/AuraLearn";
import ThinkSpace from "./pages/ThinkSpace";
import Workshop from "./pages/Workshop";
import Settings from "./pages/Settings";
import BlogWriter from "./components/thinkspace/BlogWriter";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Tourism from "./pages/Tourism";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuthCenter from "./pages/AdminAuthCenter";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Initialize GSAP ScrollSmoother
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
    });

    return () => {
      smoother?.kill();
    };
  }, []);
  
  // Update SEO on route change
  useEffect(() => {
    updateSEO(defaultSEO);
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/services" element={<Services />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><AuraLearn /></ProtectedRoute>} />
        <Route path="/thinkspace" element={<ProtectedRoute><ThinkSpace /></ProtectedRoute>} />
        <Route path="/thinkspace/write" element={<ProtectedRoute><BlogWriter /></ProtectedRoute>} />
        <Route path="/workshop" element={<ProtectedRoute><Workshop /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/tourism" element={<ProtectedRoute><Tourism /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/auth-center" element={<ProtectedRoute><AdminAuthCenter /></ProtectedRoute>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="auraup-theme">
      <DynamicExperienceProvider>
        <AuthProvider>
          <CustomAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Preloader />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <GlobalNavigation />
                <div className="main-content">
                  <AnimatedRoutes />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </CustomAuthProvider>
        </AuthProvider>
      </DynamicExperienceProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
