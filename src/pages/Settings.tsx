import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AccountInfo } from "@/components/settings/AccountInfo";
import { Preferences } from "@/components/settings/Preferences";
import { TwoFactorAuth } from "@/components/settings/TwoFactorAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your account and customize your experience
              </p>
            </div>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="mt-6">
                <AccountInfo />
              </TabsContent>

              <TabsContent value="preferences" className="mt-6">
                <Preferences />
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <TwoFactorAuth />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;