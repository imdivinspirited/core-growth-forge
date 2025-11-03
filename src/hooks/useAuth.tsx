import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: 'admin' | 'moderator' | 'user' | 'student' | 'professional') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string = 'user') => {
    try {
      // Validate inputs
      if (!email || !password || !fullName) {
        const error = new Error("All fields are required");
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return { error };
      }

      if (password.length < 8) {
        const error = new Error("Password must be at least 8 characters");
        toast({
          title: "Weak Password",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        });
        return { error };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("already registered")) {
          toast({
            title: "Email already exists",
            description: "This email is already registered. Please sign in or use a different email.",
            variant: "destructive",
          });
        } else if (error.message.includes("Password")) {
          toast({
            title: "Invalid Password",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      // Add user role - only if user was created
      if (data.user) {
        try {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: role as any,
            });

          if (roleError) {
            console.error('Error assigning role:', roleError);
            // Don't fail signup if role assignment fails
          }
        } catch (roleErr) {
          console.error('Role assignment exception:', roleErr);
        }
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast({
          title: "Check your email! 📧",
          description: "We've sent you a confirmation link. Please verify your email before signing in.",
          duration: 7000,
        });
      } else if (data.session) {
        toast({
          title: "Welcome! 🎉",
          description: "Your account has been created successfully.",
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        const error = new Error("Email and password are required");
        toast({
          title: "Validation Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        return { error };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. If you just signed up, please verify your email first.",
            variant: "destructive",
            duration: 7000,
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email not verified",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive",
            duration: 7000,
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      toast({
        title: "Welcome back! 👋",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Signin error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const hasRole = async (role: 'admin' | 'moderator' | 'user'): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', role)
        .maybeSingle();

      return !error && !!data;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
