import { AccountInfo } from "@/components/settings/AccountInfo";
import { Preferences } from "@/components/settings/Preferences";
import { TwoFactorAuth } from "@/components/settings/TwoFactorAuth";
import { DarkModeSettings } from "@/components/settings/DarkModeSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6 max-w-4xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold gradient-text">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and customize your experience
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <AccountInfo />
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <DarkModeSettings />
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Preferences />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <TwoFactorAuth />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;