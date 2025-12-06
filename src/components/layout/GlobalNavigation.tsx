import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Briefcase,
  Search,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { AuraUpLogo } from '@/components/logo/AuraUpLogo';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';
import { supabase } from '@/integrations/supabase/client';

const GlobalNavigation = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { user } = useAuth();
  const location = useLocation();

  // Load nav visibility from storage
  useEffect(() => {
    const saved = localStorage.getItem('auraup-nav-visible');
    if (saved !== null) {
      setIsNavVisible(JSON.parse(saved));
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const toggleNav = () => {
    const newState = !isNavVisible;
    setIsNavVisible(newState);
    localStorage.setItem('auraup-nav-visible', JSON.stringify(newState));
  };

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Courses', href: '/courses', icon: BookOpen },
    { label: 'Services', href: '/services', icon: Briefcase },
  ];

  const isActive = (href: string) => location.pathname === href;

  const navVariants = {
    hidden: { 
      x: -280, 
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
    },
  };

  const contentVariants = {
    expanded: { 
      marginLeft: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: { 
      marginLeft: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      <motion.button
        onClick={toggleNav}
        className="fixed top-4 left-4 z-[60] bg-card/90 backdrop-blur-md text-foreground p-2.5 rounded-xl shadow-lg border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isNavVisible ? 'Hide navigation' : 'Show navigation'}
        initial={false}
        animate={{ 
          left: isNavVisible ? 220 : 16,
          rotate: isNavVisible ? 0 : 180,
        }}
        transition={{ duration: 0.3 }}
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      {/* Navigation Sidebar */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.nav
            className="fixed left-0 top-0 h-full w-[220px] bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl z-50 flex flex-col"
            variants={navVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Logo */}
            <div className="p-4 border-b border-border/50">
              <Link to="/">
                <AuraUpLogo size="sm" />
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        active 
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <motion.div
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground"
                          layoutId="activeIndicator"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border/50 space-y-3">
              <GlobalSearch />
              
              {user ? (
                <motion.button
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all border border-primary/20"
                  onClick={() => setIsDashboardOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar className="h-9 w-9 border-2 border-primary/30">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">
                      {profile?.full_name || 'My Profile'}
                    </p>
                    <p className="text-xs text-muted-foreground">View Dashboard</p>
                  </div>
                </motion.button>
              ) : (
                <Button className="w-full" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Dashboard Panel */}
      <DashboardPanel 
        isOpen={isDashboardOpen} 
        onClose={() => setIsDashboardOpen(false)} 
      />

      {/* Content Wrapper Style Helper */}
      <style>{`
        .main-content {
          margin-left: ${isNavVisible ? '220px' : '0'};
          transition: margin-left 0.3s ease-in-out;
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
