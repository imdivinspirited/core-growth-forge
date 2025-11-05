-- Add mobile support to custom auth system and integrate with Supabase Auth
-- Add mobile_number to custom_users and make email optional
ALTER TABLE custom_users 
  ADD COLUMN IF NOT EXISTS mobile_number text,
  ADD COLUMN IF NOT EXISTS country_code text DEFAULT '+1',
  ADD COLUMN IF NOT EXISTS auth_provider text DEFAULT 'custom',
  ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make email nullable if not already
DO $$ 
BEGIN
  ALTER TABLE custom_users ALTER COLUMN email DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_users_mobile ON custom_users(mobile_number) WHERE mobile_number IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_users_email ON custom_users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_users_auth_user_id ON custom_users(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- Update otp_codes to support mobile
ALTER TABLE otp_codes 
  ADD COLUMN IF NOT EXISTS mobile_number text;

DO $$ 
BEGIN
  ALTER TABLE otp_codes ALTER COLUMN email DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Add check to ensure either email or mobile is present
DO $$
BEGIN
  ALTER TABLE otp_codes 
    ADD CONSTRAINT check_email_or_mobile CHECK (
      (email IS NOT NULL) OR (mobile_number IS NOT NULL)
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update existing profiles table RLS
DROP POLICY IF EXISTS "Public profiles viewable safely" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Add new columns to profiles if not exists
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS mobile_number text,
  ADD COLUMN IF NOT EXISTS country_code text DEFAULT '+1',
  ADD COLUMN IF NOT EXISTS mobile_verified boolean DEFAULT false;

-- Recreate RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public profiles viewable safely"
  ON profiles FOR SELECT
  USING (privacy_profile = 'public' AND auth.uid() != user_id);

-- Function to handle new OAuth user signups
CREATE OR REPLACE FUNCTION handle_new_oauth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user role
  INSERT INTO user_roles (user_id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Trigger for OAuth user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_oauth_user();