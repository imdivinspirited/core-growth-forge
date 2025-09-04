import { useState, useEffect } from "react";
import { 
  Home, 
  User, 
  BookOpen, 
  Lightbulb, 
  Hammer, 
  Settings, 
  Moon, 
  Sun, 
  ChevronDown, 
  ChevronRight,
  GraduationCap,
  FileText,
  Calendar,
  Award,
  Users
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainNavItems = [
  { 
    title: "Home", 
    href: "#home", 
    icon: Home,
    badge: "new"
  },
  { 
    title: "Profile", 
    href: "#profile", 
    icon: User,
    subItems: [
      { title: "My Profile", href: "#profile/me", icon: User },
      { title: "Portfolio", href: "#profile/portfolio", icon: FileText },
      { title: "Achievements", href: "#profile/achievements", icon: Award }
    ]
  },
  { 
    title: "SkillSpace", 
    href: "#skillspace", 
    icon: BookOpen,
    subItems: [
      { title: "Courses", href: "#skillspace/courses", icon: GraduationCap },
      { title: "Learning Path", href: "#skillspace/path", icon: FileText },
      { title: "Certifications", href: "#skillspace/certs", icon: Award }
    ]
  },
  { 
    title: "ThinkSpace", 
    href: "#thinkspace", 
    icon: Lightbulb,
    subItems: [
      { title: "Blog Posts", href: "#thinkspace/blog", icon: FileText },
      { title: "Ideas", href: "#thinkspace/ideas", icon: Lightbulb },
      { title: "Community", href: "#thinkspace/community", icon: Users }
    ]
  },
  { 
    title: "Workshop", 
    href: "#workshop", 
    icon: Hammer,
    subItems: [
      { title: "Upcoming Events", href: "#workshop/events", icon: Calendar },
      { title: "My Workshops", href: "#workshop/my", icon: Hammer },
      { title: "Resources", href: "#workshop/resources", icon: FileText }
    ]
  },
];

export function AppSidebar() {
  const { state, open, setOpen } = useSidebar();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  const currentPath = location.hash || "#home";

  const isActive = (path: string) => currentPath === path;
  const isParentActive = (item: any) => {
    if (isActive(item.href)) return true;
    return item.subItems?.some((sub: any) => isActive(sub.href));
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  // Auto-expand parent of active item
  useEffect(() => {
    mainNavItems.forEach(item => {
      if (item.subItems && item.subItems.some(sub => isActive(sub.href))) {
        if (!expandedItems.includes(item.title)) {
          setExpandedItems(prev => [...prev, item.title]);
        }
      }
    });
  }, [currentPath]);

  const getNavClasses = (isActiveItem: boolean) => {
    return `${
      isActiveItem 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-sidebar-ring" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    } transition-all duration-200 group relative`;
  };

  const collapsed = state === "collapsed";
  const isHidden = !open;

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
    }
  }, [currentPath, isMobile, open, setOpen]);

  return (
    <Sidebar
      className={`${
        isHidden ? (isMobile ? "-translate-x-full w-0" : "w-0") : 
        collapsed ? (isMobile ? "w-full" : "w-16") : 
        isMobile ? "w-full" : "w-64"
      } transition-all duration-300 ease-in-out shadow-lg border-r border-sidebar-border bg-sidebar/95 backdrop-blur-sm
      ${isMobile ? "fixed left-0 top-0 h-full z-50" : "relative"}
      ${isHidden ? "pointer-events-none" : "pointer-events-auto"}
      overflow-hidden`}
      collapsible={isMobile ? "none" : "icon"}
    >
      {/* Header with Logo */}
      <SidebarHeader className={`border-b border-sidebar-border/50 p-4 ${isHidden ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary to-primary-glow p-2 rounded-lg shadow-md">
            <User className="h-6 w-6 text-white" />
          </div>
          {(!collapsed || isMobile) && !isHidden && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">BrandSpace</span>
              <span className="text-xs text-sidebar-foreground/60">Professional Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`px-2 py-4 ${isHidden ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <SidebarGroup>
          <SidebarGroupLabel className={(collapsed && !isMobile) || isHidden ? "sr-only" : "text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wide mb-2"}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItems.includes(item.title);
                const parentActive = isParentActive(item);

                return (
                  <SidebarMenuItem key={item.title}>
                    {hasSubItems ? (
                      <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(item.title)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton 
                            className={getNavClasses(parentActive)}
                            disabled={isHidden}
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {(!collapsed || isMobile) && !isHidden && (
                              <>
                                <span className="flex-1 text-left">{item.title}</span>
                                {item.badge && (
                                  <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                                {isExpanded ? (
                                  <ChevronDown className="h-3 w-3 transition-transform" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 transition-transform" />
                                )}
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        
                        {(!collapsed || isMobile) && !isHidden && (
                          <CollapsibleContent className="ml-4 mt-1">
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton 
                                    asChild 
                                    className={getNavClasses(isActive(subItem.href))}
                                  >
                                    <a 
                                      href={subItem.href} 
                                      className="flex items-center space-x-2 py-1.5"
                                      onClick={isMobile ? () => setOpen(false) : undefined}
                                    >
                                      <subItem.icon className="h-3 w-3" />
                                      <span>{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton 
                        asChild 
                        className={getNavClasses(isActive(item.href))}
                        disabled={isHidden}
                      >
                        <a 
                          href={item.href} 
                          className="flex items-center space-x-2"
                          onClick={isMobile ? () => setOpen(false) : undefined}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {(!collapsed || isMobile) && !isHidden && (
                            <>
                              <span className="flex-1">{item.title}</span>
                              {item.badge && (
                                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Settings and Theme Toggle */}
      <SidebarFooter className={`border-t border-sidebar-border/50 p-2 ${isHidden ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className={getNavClasses(false)}
              disabled={isHidden}
            >
              <a 
                href="#settings" 
                className="flex items-center space-x-2"
                onClick={isMobile ? () => setOpen(false) : undefined}
              >
                <Settings className="h-4 w-4 flex-shrink-0" />
                {(!collapsed || isMobile) && !isHidden && <span>Settings</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-full justify-start ${getNavClasses(false)} border-0`}
              disabled={isHidden}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Moon className="h-4 w-4 flex-shrink-0" />
              )}
              {(!collapsed || isMobile) && !isHidden && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}