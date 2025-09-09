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
  Users,
  PenTool,
  Brain
} from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";
import { useTheme } from "next-themes";

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
    href: "/", 
    icon: Home,
    badge: "new"
  },
  { 
    title: "Profile", 
    href: "/profile", 
    icon: User,
    subItems: [
      { title: "My Profile", href: "/profile", icon: User },
      { title: "Portfolio", href: "/profile#portfolio", icon: FileText },
      { title: "Achievements", href: "/profile#achievements", icon: Award }
    ]
  },
  { 
    title: "SkillSpace", 
    href: "/skillspace", 
    icon: BookOpen,
    subItems: [
      { title: "All Courses", href: "/skillspace", icon: GraduationCap },
      { title: "My Progress", href: "/skillspace#progress", icon: FileText },
      { title: "Certificates", href: "/skillspace#certificates", icon: Award }
    ]
  },
  { 
    title: "ThinkSpace", 
    href: "/thinkspace", 
    icon: PenTool,
    subItems: [
      { title: "All Blogs", href: "/thinkspace", icon: FileText },
      { title: "Community", href: "/thinkspace#community", icon: Users },
      { title: "My Bookmarks", href: "/thinkspace#bookmarks", icon: BookOpen }
    ]
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const currentPath = location.pathname + (location.hash || "");

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

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out shadow-lg border-r border-sidebar-border bg-sidebar/95 backdrop-blur-sm`}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary to-primary-glow p-2 rounded-lg shadow-md">
            <User className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">BrandSpace</span>
              <span className="text-xs text-sidebar-foreground/60">Professional Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wide mb-2"}>
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
                          <SidebarMenuButton className={getNavClasses(parentActive)}>
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {!collapsed && (
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
                        
                        {!collapsed && (
                          <CollapsibleContent className="ml-4 mt-1">
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                   <SidebarMenuSubButton 
                                    asChild 
                                    className={getNavClasses(isActive(subItem.href))}
                                  >
                                    <NavLink to={subItem.href} className="flex items-center space-x-2 py-1.5">
                                      <subItem.icon className="h-3 w-3" />
                                      <span>{subItem.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild className={getNavClasses(isActive(item.href))}>
                        <NavLink to={item.href} className="flex items-center space-x-2">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1">{item.title}</span>
                              {item.badge && (
                                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </NavLink>
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
      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={getNavClasses(false)}>
              <NavLink to="/settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-full justify-start ${getNavClasses(false)} border-0`}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Moon className="h-4 w-4 flex-shrink-0" />
              )}
              {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}