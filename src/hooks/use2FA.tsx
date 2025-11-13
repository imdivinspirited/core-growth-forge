import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function use2FA(sessionToken: string | null) {
  const [loading, setLoading] = useState(false);

  const generate2FA = async () => {
    if (!sessionToken) {
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twofactor-generate', {
        body: { sessionToken },
      });

      if (error) return { error: error.message };
      if (data.error) return { error: data.error };

      return { otpauth: data.otpauth };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (token: string) => {
    if (!sessionToken) {
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twofactor-verify', {
        body: { sessionToken, token },
      });

      if (error) return { error: error.message };
      if (data.error) return { error: data.error };

      toast.success('2FA enabled successfully');
      return { recoveryCodes: data.recoveryCodes };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verify2FASignin = async (token: string, isRecoveryCode = false) => {
    if (!sessionToken) {
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twofactor-signin', {
        body: { sessionToken, token, isRecoveryCode },
      });

      if (error) return { error: error.message };
      if (data.error) return { error: data.error };

      toast.success('2FA verified successfully');
      return { user: data.user, session: data.session };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!sessionToken) {
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twofactor-disable', {
        body: { sessionToken },
      });

      if (error) return { error: error.message };
      if (data.error) return { error: data.error };

      toast.success('2FA disabled successfully');
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generate2FA,
    verify2FA,
    verify2FASignin,
    disable2FA,
  };
}
