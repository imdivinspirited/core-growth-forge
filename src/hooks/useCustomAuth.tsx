import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  mobileNumber: string;
  countryCode: string;
  fullName?: string;
  isVerified: boolean;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (mobileNumber: string, countryCode: string, password: string, fullName: string) => Promise<{ error: any; requiresOtp?: boolean; otp?: string }>;
  signIn: (mobileNumber: string, countryCode: string, password: string) => Promise<{ error: any; requiresOtp?: boolean; otp?: string }>;
  verifyOtp: (mobileNumber: string, countryCode: string, otpCode: string, otpType: 'signup' | 'signin') => Promise<{ error: any }>;
  forgotPassword: (mobileNumber: string, countryCode: string) => Promise<{ error: any; requiresOtp?: boolean; otp?: string }>;
  resetPassword: (mobileNumber: string, countryCode: string, otpCode: string, newPassword: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  sessionToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function CustomAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('custom_session_token');
    if (token) {
      validateSession(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateSession = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-session', {
        body: { sessionToken: token },
      });

      if (error || !data) {
        localStorage.removeItem('custom_session_token');
        setUser(null);
        setSessionToken(null);
        setLoading(false);
        return;
      }

      setUser(data.user);
      setSessionToken(data.session.token);
      setLoading(false);
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('custom_session_token');
      setUser(null);
      setSessionToken(null);
      setLoading(false);
    }
  };

  const signUp = async (mobileNumber: string, countryCode: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-signup', {
        body: { mobileNumber, countryCode, password, fullName },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.error) {
        return { error: data.error };
      }

      toast.success('OTP sent to your mobile number');
      
      return { 
        error: null, 
        requiresOtp: true
      };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signIn = async (mobileNumber: string, countryCode: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-signin', {
        body: { mobileNumber, countryCode, password },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.error) {
        return { error: data.error };
      }

      toast.success('OTP sent to your mobile number');

      return { 
        error: null, 
        requiresOtp: true
      };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const verifyOtp = async (mobileNumber: string, countryCode: string, otpCode: string, otpType: 'signup' | 'signin') => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-verify-otp', {
        body: { mobileNumber, countryCode, otpCode, otpType },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.error) {
        return { error: data.error };
      }

      // Store session
      localStorage.setItem('custom_session_token', data.session.token);
      setSessionToken(data.session.token);
      setUser(data.user);

      toast.success('Successfully authenticated!');
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const forgotPassword = async (mobileNumber: string, countryCode: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-forgot-password', {
        body: { mobileNumber, countryCode },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.error) {
        return { error: data.error };
      }

      toast.success('Password reset OTP sent to your mobile number');
      
      return { 
        error: null, 
        requiresOtp: true
      };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const resetPassword = async (mobileNumber: string, countryCode: string, otpCode: string, newPassword: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-reset-password', {
        body: { mobileNumber, countryCode, otpCode, newPassword },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.error) {
        return { error: data.error };
      }

      toast.success('Password reset successfully!');
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user || !sessionToken) {
        return { error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('custom_users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      setUser({ ...user, ...data });
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    try {
      if (sessionToken) {
        await supabase.functions.invoke('auth-signout', {
          body: { sessionToken },
        });
      }

      localStorage.removeItem('custom_session_token');
      setSessionToken(null);
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      verifyOtp, 
      forgotPassword, 
      resetPassword, 
      updateProfile,
      signOut, 
      sessionToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCustomAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCustomAuth must be used within a CustomAuthProvider');
  }
  return context;
}