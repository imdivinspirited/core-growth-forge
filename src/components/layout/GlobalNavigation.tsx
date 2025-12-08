/**
 * GlobalNavigation Component
 * 
 * A professional, enterprise-grade navigation system with:
 * - Animated sidebar with glassmorphism effects
 * - Professional hide/show toggle button with visual feedback
 * - User authentication state integration
 * - Micro-interactions and smooth transitions
 * - Keyboard accessibility support
 * 
 * Concept: Component Composition Pattern - Breaking UI into reusable pieces
 * Concept: Framer Motion for declarative animations
 * Concept: React Context for global auth state access
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  BookOpen,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Settings,
  LogOut,
  User,
  Sparkles,
  ChevronRight,
  MessageSquare,
  GraduationCap,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { AuraUpLogo } from '@/components/logo/AuraUpLogo';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/**
 * Navigation Item Interface
 * Concept: TypeScript Interface - Defining strict types for data structures
 */
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  description?: string;
}

/**
 * Main Navigation Component
 * Concept: Functional Component with Hooks for state management
 */
const GlobalNavigation = () => {
  // State Management
  // Concept: useState Hook - Managing local component state
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  
  // Hooks for routing and authentication
  // Concept: Custom Hooks - Reusable stateful logic
  const { user: oAuthUser, signOut: oAuthSignOut } = useAuth();
  const { user: customUser, signOut: customSignOut } = useCustomAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active user (OAuth or Custom auth)
  // Concept: Derived State - Computing values from existing state
  const user = oAuthUser || customUser;
  const isAuthenticated = !!user;

  /**
   * Load navigation visibility preference from localStorage
   * Concept: useEffect for side effects - Syncing with browser storage
   */
  useEffect(() => {
    const saved = localStorage.getItem('auraup-nav-visible');
    if (saved !== null) {
      setIsNavVisible(JSON.parse(saved));
    }
  }, []);

  /**
   * Fetch user profile data from Supabase
   * Concept: Data Fetching in useEffect with cleanup consideration
   */
  useEffect(() => {
    const fetchProfile = async () => {
      if (oAuthUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', oAuthUser.id)
          .maybeSingle();
        setProfile(data);
      } else if (customUser) {
        setProfile({
          full_name: customUser.fullName,
          avatar_url: null,
        });
      }
    };
    
    fetchProfile();
  }, [oAuthUser, customUser]);

  /**
   * Toggle navigation visibility with persistence
   * Concept: useCallback - Memoizing functions to prevent unnecessary re-renders
   */
  const toggleNav = useCallback(() => {
    const newState = !isNavVisible;
    setIsNavVisible(newState);
    localStorage.setItem('auraup-nav-visible', JSON.stringify(newState));
  }, [isNavVisible]);

  /**
   * Handle sign out for both auth systems
   * Concept: Unified interface for different auth providers
   */
  const handleSignOut = async () => {
    if (oAuthUser) {
      await oAuthSignOut();
    } else if (customUser) {
      await customSignOut();
    }
    navigate('/');
  };

  /**
   * Navigation items configuration
   * Concept: Configuration-driven UI - Define structure, render dynamically
   */
  const navItems: NavItem[] = [
    { 
      label: 'Home', 
      href: '/', 
      icon: Home,
      description: 'Return to homepage'
    },
    { 
      label: 'Courses', 
      href: '/courses', 
      icon: GraduationCap,
      badge: 'New',
      description: 'Browse learning materials'
    },
    { 
      label: 'Services', 
      href: '/services', 
      icon: Briefcase,
      description: 'Explore our services'
    },
    { 
      label: 'ThinkSpace', 
      href: '/thinkspace', 
      icon: MessageSquare,
      description: 'Community & blogs'
    },
    { 
      label: 'Tourism', 
      href: '/tourism', 
      icon: Globe,
      description: 'Travel experiences'
    },
  ];

  /**
   * Check if route is active
   * Concept: Helper function for conditional styling
   */
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  /**
   * Animation variants for Framer Motion
   * Concept: Animation Variants - Reusable animation states
   */
  const sidebarVariants = {
    hidden: { 
      x: -280, 
      opacity: 0,
      transition: { 
        type: 'spring' as const,
        stiffness: 400,
        damping: 40
      }
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring' as const,
        stiffness: 400,
        damping: 40
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring' as const,
        stiffness: 300,
        damping: 24
      }
    }),
  };

  return (
    <>
      {/* Professional Toggle Button - Always visible */}
      {/* Concept: Accessible UI - Proper ARIA labels and keyboard support */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={toggleNav}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={cn(
              "fixed z-[60] flex items-center justify-center",
              "w-12 h-12 rounded-2xl",
              "bg-gradient-to-br from-card/95 to-card/80",
              "backdrop-blur-xl border border-border/50",
              "shadow-lg shadow-black/5",
              "transition-all duration-300 ease-out",
              "hover:shadow-xl hover:shadow-primary/10",
              "hover:border-primary/30",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
              "group"
            )}
            style={{ top: 16 }}
            animate={{ 
              left: isNavVisible ? 232 : 16,
              backgroundColor: isHovering ? 'hsl(var(--primary) / 0.1)' : 'transparent',
            }}
            transition={{ 
              type: 'spring',
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isNavVisible ? 'Collapse navigation' : 'Expand navigation'}
            aria-expanded={isNavVisible}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isNavVisible ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {isNavVisible ? (
                  <PanelLeftClose className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <PanelLeftOpen className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovering ? 0.5 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {isNavVisible ? 'Collapse sidebar' : 'Expand sidebar'}
        </TooltipContent>
      </Tooltip>

      {/* Navigation Sidebar */}
      {/* Concept: AnimatePresence for mount/unmount animations */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.nav
            className={cn(
              "fixed left-0 top-0 h-full w-[220px] z-50",
              "flex flex-col",
              "bg-gradient-to-b from-card/98 via-card/95 to-card/90",
              "backdrop-blur-2xl",
              "border-r border-border/40",
              "shadow-2xl shadow-black/10"
            )}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Logo Section */}
            <div className="p-5 border-b border-border/30">
              <Link to="/" className="block">
                <AuraUpLogo size="sm" showTagline />
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div
                    key={item.label}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl",
                            "transition-all duration-200 group relative",
                            "focus:outline-none focus:ring-2 focus:ring-primary/50",
                            active 
                              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25" 
                              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5 flex-shrink-0",
                            active ? "" : "group-hover:scale-110 transition-transform"
                          )} />
                          <span className="font-medium text-sm flex-1">{item.label}</span>
                          
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                active 
                                  ? "bg-primary-foreground/20 text-primary-foreground" 
                                  : "bg-primary/10 text-primary"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          
                          {active && (
                            <motion.div
                              className="absolute right-2"
                              layoutId="navActiveIndicator"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.div>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        {item.description}
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Section - Search & User */}
            <div className="p-4 border-t border-border/30 space-y-3">
              {/* Global Search */}
              <GlobalSearch />
              
              {/* User Section */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  {/* Notifications */}
                  <motion.button
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl",
                      "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                      "transition-all duration-200"
                    )}
                    whileHover={{ x: 4 }}
                    onClick={() => navigate('/settings')}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="text-sm font-medium">Notifications</span>
                    {notifications > 0 && (
                      <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-1.5">
                        {notifications}
                      </Badge>
                    )}
                  </motion.button>

                  {/* User Profile Card */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl",
                          "bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5",
                          "hover:from-primary/10 hover:via-primary/15 hover:to-accent/10",
                          "border border-primary/10 hover:border-primary/20",
                          "transition-all duration-300 group"
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                          <AvatarImage src={profile?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                            {profile?.full_name?.charAt(0) || (oAuthUser as any)?.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-semibold truncate text-foreground">
                            {profile?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-primary" />
                            Pro Member
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 bg-card/95 backdrop-blur-xl border-border/50"
                      sideOffset={8}
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">
                            {(oAuthUser as any)?.email || (customUser as any)?.mobileNumber || 'Account'}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => setIsDashboardOpen(true)}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20" 
                    asChild
                  >
                    <Link to="/auth">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Started
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Dashboard Panel Overlay */}
      <DashboardPanel 
        isOpen={isDashboardOpen} 
        onClose={() => setIsDashboardOpen(false)} 
      />

      {/* Dynamic Content Margin Styles */}
      {/* Concept: CSS-in-JS for dynamic styling based on component state */}
      <style>{`
        .main-content {
          margin-left: ${isNavVisible ? '220px' : '0'};
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 100vh;
        }
        
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
};

export default GlobalNavigation;
