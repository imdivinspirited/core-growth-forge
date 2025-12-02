import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PageTransition } from "@/components/animations/PageTransition";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import HeroSection from "@/components/home/HeroSection";
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
            {/* Minimal Header with Sidebar Toggle */}
            <header className="h-12 flex items-center border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-40 px-4">
              <SidebarTrigger className="mr-4" />
            </header>
            
            <main>
              <PageTransition>
                <HeroSection />
                <AnimatedSection delay={0.1}>
                  <FeaturedContent />
                </AnimatedSection>
                <AnimatedSection delay={0.2}>
                  <PortfolioSnapshot />
                </AnimatedSection>
                <AnimatedSection delay={0.1}>
                  <QuickAccessTools />
                </AnimatedSection>
                <AnimatedSection delay={0.2}>
                  <TrendingContent />
                </AnimatedSection>
                <AnimatedSection delay={0.1}>
                  <AnnouncementsPanel />
                </AnimatedSection>
                <AnimatedSection delay={0.2}>
                  <MiniDashboard />
                </AnimatedSection>
                <AnimatedSection delay={0.1}>
                  <InteractiveElements />
                </AnimatedSection>
              </PageTransition>
      </main>
      
      {/* Footer */}
      <AnimatedSection>
        <footer className="bg-navy text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-4 gap-8">
              <AnimatedSection delay={0.1}>
                <div>
                  <h3 className="text-xl font-bold mb-4">AuraUp</h3>
                  <p className="text-white/80 text-sm">
                    Empowering individuals to elevate their skills and transform their careers through innovative learning experiences.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div>
                  <h4 className="font-semibold mb-3">Platform</h4>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li className="hover:text-white transition-colors cursor-pointer">Courses</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Workshops</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Portfolio</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Tools</li>
                  </ul>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <div>
                  <h4 className="font-semibold mb-3">Community</h4>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Forums</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Events</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Mentorship</li>
                  </ul>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.4}>
                <div>
                  <h4 className="font-semibold mb-3">Support</h4>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Terms</li>
                  </ul>
                </div>
              </AnimatedSection>
            </div>
              <AnimatedSection delay={0.5}>
                <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
                  <p>&copy; 2024 AuraUp. All rights reserved.</p>
                </div>
              </AnimatedSection>
          </div>
        </footer>
      </AnimatedSection>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Index;
