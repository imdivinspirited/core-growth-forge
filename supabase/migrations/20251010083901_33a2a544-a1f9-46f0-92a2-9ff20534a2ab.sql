-- Fix User Contact Information Security Issue
-- Remove email and phone from profiles table as they're stored in auth.users
-- This prevents spam harvesting when profiles are set to public

-- First, check and drop all existing public profile policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable with limited info" ON public.profiles;
  DROP POLICY IF EXISTS "Public profiles show only basic info" ON public.profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Remove email and phone columns from profiles table
-- These are already available in auth.users and should not be duplicated
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone;

-- Create a new, safer public profile viewing policy
-- Only allows viewing basic profile info, excluding any sensitive data
CREATE POLICY "Public profiles viewable safely"
ON public.profiles
FOR SELECT
USING (
  privacy_profile = 'public' 
  AND auth.uid() != user_id
);

-- Fix Vendor Contact Information Security Issue
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Verified vendors viewable by all" ON public.vendors;
  DROP POLICY IF EXISTS "Verified vendors basic info viewable by all" ON public.vendors;
  DROP POLICY IF EXISTS "Vendors can view their full profile" ON public.vendors;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create policy for verified vendors - limits what anonymous users can see
-- Application code MUST filter out email, phone, address, website for non-owners
CREATE POLICY "Public can view verified vendors"
ON public.vendors
FOR SELECT
USING (
  verification_status = 'verified'
  OR auth.uid() = user_id
  OR has_role(auth.uid(), 'admin')
);

-- Fix Payments Security - Ensure vendors cannot view payment details
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users view only their own payments" ON public.payments;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT  
USING (
  auth.uid() = user_id
);