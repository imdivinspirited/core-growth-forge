import { motion } from 'framer-motion';
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
import { useDynamicExperience } from '@/context/DynamicExperienceContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { theme, layout, animation } = useDynamicExperience();

  // Simple page animation
  const pageTransition = {
    duration: animation.duration,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <motion.div 
      className="min-h-screen w-full bg-background overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={pageTransition}
    >
      <PageTransition>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Content */}
        <AnimatedSection delay={0.1}>
          <FeaturedContent />
        </AnimatedSection>
        
        {/* Portfolio Snapshot */}
        <AnimatedSection delay={0.15}>
          <PortfolioSnapshot />
        </AnimatedSection>
        
        {/* Quick Access Tools */}
        <AnimatedSection delay={0.1}>
          <QuickAccessTools />
        </AnimatedSection>
        
        {/* Trending Content */}
        <AnimatedSection delay={0.15}>
          <TrendingContent />
        </AnimatedSection>
        
        {/* Announcements */}
        <AnimatedSection delay={0.1}>
          <AnnouncementsPanel />
        </AnimatedSection>
        
        {/* Mini Dashboard */}
        <AnimatedSection delay={0.15}>
          <MiniDashboard />
        </AnimatedSection>
        
        {/* Interactive Elements */}
        <AnimatedSection delay={0.1}>
          <InteractiveElements />
        </AnimatedSection>
        
        {/* Footer */}
        <AnimatedSection>
          <footer className="bg-card border-t border-border py-16 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5">
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}
              />
            </div>
            
            <div className="container mx-auto px-4 relative">
              <div className="grid md:grid-cols-4 gap-8">
                {/* Brand */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-4 gradient-text">AuraUp</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Empowering individuals to elevate their skills and transform their careers through innovative learning experiences.
                  </p>
                </motion.div>
                
                {/* Platform Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li>
                      <Link to="/courses" className="hover:text-primary transition-colors">
                        Courses
                      </Link>
                    </li>
                    <li>
                      <Link to="/thinkspace" className="hover:text-primary transition-colors">
                        ThinkSpace
                      </Link>
                    </li>
                    <li>
                      <Link to="/learn" className="hover:text-primary transition-colors">
                        AuraLearn
                      </Link>
                    </li>
                    <li>
                      <Link to="/services" className="hover:text-primary transition-colors">
                        Services
                      </Link>
                    </li>
                  </ul>
                </motion.div>
                
                {/* Community Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h4 className="font-semibold mb-4 text-foreground">Community</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li>
                      <Link to="/thinkspace" className="hover:text-primary transition-colors">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link to="/chat" className="hover:text-primary transition-colors">
                        Forums
                      </Link>
                    </li>
                    <li>
                      <Link to="/workshop" className="hover:text-primary transition-colors">
                        Events
                      </Link>
                    </li>
                    <li>
                      <span className="cursor-pointer hover:text-primary transition-colors">
                        Mentorship
                      </span>
                    </li>
                  </ul>
                </motion.div>
                
                {/* Support Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h4 className="font-semibold mb-4 text-foreground">Support</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li>
                      <span className="cursor-pointer hover:text-primary transition-colors">
                        Help Center
                      </span>
                    </li>
                    <li>
                      <span className="cursor-pointer hover:text-primary transition-colors">
                        Contact Us
                      </span>
                    </li>
                    <li>
                      <span className="cursor-pointer hover:text-primary transition-colors">
                        Privacy
                      </span>
                    </li>
                    <li>
                      <span className="cursor-pointer hover:text-primary transition-colors">
                        Terms
                      </span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="border-t border-border mt-12 pt-8 text-center"
              >
                <p className="text-muted-foreground text-sm">
                  &copy; {new Date().getFullYear()} AuraUp. All rights reserved.
                </p>
              </motion.div>
            </div>
          </footer>
        </AnimatedSection>
      </PageTransition>
    </motion.div>
  );
};

export default Index;
