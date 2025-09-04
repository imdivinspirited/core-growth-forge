import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedContent from "@/components/home/FeaturedContent";
import PortfolioSnapshot from "@/components/home/PortfolioSnapshot";
import QuickAccessTools from "@/components/home/QuickAccessTools";
import TrendingContent from "@/components/home/TrendingContent";
import AnnouncementsPanel from "@/components/home/AnnouncementsPanel";
import MiniDashboard from "@/components/home/MiniDashboard";
import InteractiveElements from "@/components/home/InteractiveElements";

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <SidebarProvider>
        <div className="min-h-screen w-full flex bg-background">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Top Header with Sidebar Toggle */}
            <header className="h-12 flex items-center border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40 px-4">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold text-foreground">BrandSpace Dashboard</h1>
            </header>
            
            <main className="flex-1 overflow-auto">
        <HeroBanner />
        <FeaturedContent />
        <PortfolioSnapshot />
        <QuickAccessTools />
        <TrendingContent />
        <AnnouncementsPanel />
        <MiniDashboard />
        <InteractiveElements />
      </main>
      
      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BrandSpace</h3>
              <p className="text-white/80 text-sm">
                Empowering professionals to build their personal brand and advance their careers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>Courses</li>
                <li>Workshops</li>
                <li>Portfolio</li>
                <li>Tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>Blog</li>
                <li>Forums</li>
                <li>Events</li>
                <li>Mentorship</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2024 BrandSpace. All rights reserved.</p>
          </div>
        </div>
            </footer>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Index;
