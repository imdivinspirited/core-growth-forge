import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, AlertTriangle, FileCheck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKYC: 0,
    fraudAlerts: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const checkAdminRole = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (!data) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    setIsAdmin(true);
  };

  const loadStats = async () => {
    const [users, kyc, fraud, payments] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("kyc_documents").select("id", { count: "exact" }).eq("verification_status", "pending"),
      supabase.from("fraud_alerts").select("id", { count: "exact" }).eq("status", "open"),
      supabase.from("payments").select("id", { count: "exact" }).eq("status", "pending"),
    ]);

    setStats({
      totalUsers: users.count || 0,
      pendingKYC: kyc.count || 0,
      fraudAlerts: fraud.count || 0,
      pendingPayments: payments.count || 0,
    });
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 pt-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <FileCheck className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingKYC}</p>
                <p className="text-sm text-muted-foreground">Pending KYC</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.fraudAlerts}</p>
                <p className="text-sm text-muted-foreground">Fraud Alerts</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Alerts</TabsTrigger>
            <TabsTrigger value="content">Content Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <p className="text-muted-foreground">User management interface coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="kyc">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">KYC Verification Queue</h2>
              <p className="text-muted-foreground">KYC verification interface coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="fraud">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Fraud Detection</h2>
              <p className="text-muted-foreground">Fraud monitoring interface coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Content Moderation</h2>
              <p className="text-muted-foreground">Content moderation interface coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;