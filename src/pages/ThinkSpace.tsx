import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogListing } from "@/components/thinkspace/BlogListing";
import { CommunitySection } from "@/components/thinkspace/CommunitySection";
import { Bookmarks } from "@/components/thinkspace/Bookmarks";
import { Search, BookOpen, Users, Bookmark, PenTool } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DarkModeToggle } from "@/components/thinkspace/DarkModeToggle";
import { MultiLanguageToggle } from "@/components/thinkspace/MultiLanguageToggle";

const ThinkSpace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Minimal Header with Sidebar Toggle */}
          <header className="h-12 flex items-center border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-40 px-4">
            <SidebarTrigger className="mr-4" />
          </header>
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <PenTool className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      ThinkSpace
                    </h1>
                  </div>
                  <p className="text-xl text-muted-foreground">
                    Explore ideas, share knowledge, and connect with the community
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <DarkModeToggle />
                  <MultiLanguageToggle />
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search blogs, discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="blogs" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                <TabsTrigger value="blogs" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Blogs
                </TabsTrigger>
                <TabsTrigger value="community" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Community
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmarks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="blogs" className="space-y-6">
                <BlogListing searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="community" className="space-y-6">
                <CommunitySection searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="bookmarks" className="space-y-6">
                <Bookmarks searchQuery={searchQuery} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ThinkSpace;