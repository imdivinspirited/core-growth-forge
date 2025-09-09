import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { LiveSessions } from "@/components/workshop/LiveSessions";
import { ScreenShare } from "@/components/workshop/ScreenShare";
import { EventsCalendar } from "@/components/workshop/EventsCalendar";
import { WorkshopMaterials } from "@/components/workshop/WorkshopMaterials";
import { FeedbackPanel } from "@/components/workshop/FeedbackPanel";
import { ParticipationBadges } from "@/components/workshop/ParticipationBadges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Workshop = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Workshop Hub
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join live sessions, share screens, access materials, and earn badges through interactive workshops
              </p>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="sessions" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-6 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-6">
                    <LiveSessions />
                  </div>
                  <div className="space-y-6">
                    <ScreenShare />
                    <FeedbackPanel />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <EventsCalendar />
              </TabsContent>

              <TabsContent value="materials" className="mt-6">
                <WorkshopMaterials />
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <ParticipationBadges />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Workshop;