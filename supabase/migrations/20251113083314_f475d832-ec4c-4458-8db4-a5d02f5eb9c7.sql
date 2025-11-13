-- Create 2FA tables and admin sessions policy

-- Ensure enum app_role exists (already in project). Proceed with tables.

-- Two-factor settings table
CREATE TABLE IF NOT EXISTS public.two_factor_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.custom_users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recovery codes table (hashed)
CREATE TABLE IF NOT EXISTS public.two_factor_recovery_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.custom_users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and lock down direct access
ALTER TABLE public.two_factor_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_factor_recovery_codes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'two_factor_settings' AND policyname = 'No direct access to 2FA settings'
  ) THEN
    CREATE POLICY "No direct access to 2FA settings"
    ON public.two_factor_settings
    FOR ALL
    USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'two_factor_recovery_codes' AND policyname = 'No direct access to 2FA recovery codes'
  ) THEN
    CREATE POLICY "No direct access to 2FA recovery codes"
    ON public.two_factor_recovery_codes
    FOR ALL
    USING (false);
  END IF;
END $$;

-- Update trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_two_factor_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_two_factor_settings_updated_at
    BEFORE UPDATE ON public.two_factor_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Allow admins to view all user sessions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_sessions' AND policyname = 'Admins can view all sessions'
  ) THEN
    CREATE POLICY "Admins can view all sessions"
    ON public.user_sessions
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;