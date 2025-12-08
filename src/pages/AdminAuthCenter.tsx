import { useEffect, useState } from "react";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, LogOut, Users, Activity, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Session {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_activity_at: string;
  expires_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  created_at: string;
  ip_address: string | null;
}


export default function AdminAuthCenter() {
  const { user, sessionToken } = useCustomAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("user");

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
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
        description: "Admin privileges required",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    setIsAdmin(true);
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadSessions(), loadUserRoles(), loadAuditLogs()]);
    setLoading(false);
  };

  const loadSessions = async () => {
    const { data } = await supabase
      .from('user_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) setSessions(data);
  };

  const loadUserRoles = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setUserRoles(data);
  };

  const loadAuditLogs = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) {
      const typedData: AuditLog[] = data.map(log => ({
        id: log.id,
        user_id: log.user_id ?? null,
        action: log.action,
        table_name: log.table_name ?? null,
        created_at: log.created_at,
        ip_address: log.ip_address ? String(log.ip_address) : null,
      }));
      setAuditLogs(typedData);
    }
  };

  const revokeSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Session revoked successfully",
    });
    loadSessions();
  };

  const updateUserRole = async () => {
    if (!selectedUserId || !newRole) {
      toast({
        title: "Validation Error",
        description: "Please select a user and role",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('user_roles')
      .upsert({ 
        user_id: selectedUserId, 
        role: newRole as 'admin' | 'moderator' | 'user'
      }, {
        onConflict: 'user_id,role'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User role updated successfully",
    });
    loadUserRoles();
  };

  if (!isAdmin || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Auth Center</h1>
        </div>

        <Tabs defaultValue="sessions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sessions" className="gap-2">
              <Activity className="h-4 w-4" />
              Active Sessions
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Users className="h-4 w-4" />
              User Roles
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Active User Sessions</CardTitle>
                <CardDescription>
                  Monitor and manage all active user sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-xs">
                          {session.user_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{session.ip_address}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {session.user_agent}
                        </TableCell>
                        <TableCell>
                          {new Date(session.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(session.expires_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeSession(session.id)}
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>User Role Management</CardTitle>
                <CardDescription>
                  Assign and manage user roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="User ID"
                    className="flex-1 px-3 py-2 border rounded-md"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  />
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={updateUserRole}>Update Role</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((userRole) => (
                      <TableRow key={userRole.id}>
                        <TableCell className="font-mono text-xs">
                          {userRole.user_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={userRole.role === 'admin' ? 'destructive' : 'default'}>
                            {userRole.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(userRole.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  Recent authentication and security events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.user_id?.substring(0, 8) || 'System'}...
                        </TableCell>
                        <TableCell>
                          <Badge>{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.table_name}</TableCell>
                        <TableCell>{log.ip_address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}