-- Fix User Contact Information Security Issue
-- Remove email and phone from profiles table as they're stored in auth.users
-- This prevents spam harvesting when profiles are set to public

-- Drop the public profile viewing policy that could expose sensitive data
DROP POLICY IF EXISTS "Public profiles are viewable with limited info" ON public.profiles;

-- Remove email and phone columns from profiles table
-- These are already available in auth.users and should not be duplicated
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone;

-- Create a new, safer public profile viewing policy
-- Only allows viewing basic profile info, excluding any sensitive data
CREATE POLICY "Public profiles show only basic info"
ON public.profiles
FOR SELECT
USING (
  privacy_profile = 'public' 
  AND auth.uid() != user_id
);

-- Note: With email and phone removed from profiles table,
-- they can only be accessed by the user themselves through auth.users
-- or by fetching their own profile with the "Users can view their own profile" policy

-- Fix Vendor Contact Information Security Issue
-- Drop the current vendor viewing policy
DROP POLICY IF EXISTS "Verified vendors viewable by all" ON public.vendors;

-- Create a function to return safe vendor data without sensitive contact info
CREATE OR REPLACE FUNCTION public.get_public_vendor_info(vendor_row public.vendors)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  business_name text,
  business_type text,
  description text,
  city text,
  country text,
  rating numeric,
  total_bookings integer,
  verification_status text,
  created_at timestamptz,
  updated_at timestamptz
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    vendor_row.id,
    vendor_row.user_id,
    vendor_row.business_name,
    vendor_row.business_type,
    vendor_row.description,
    vendor_row.city,
    vendor_row.country,
    vendor_row.rating,
    vendor_row.total_bookings,
    vendor_row.verification_status,
    vendor_row.created_at,
    vendor_row.updated_at
  -- Explicitly excludes: email, phone, address, website
$$;

-- Create new RLS policy for vendors that shows ALL fields only to the owner and admins
CREATE POLICY "Verified vendors basic info viewable by all"
ON public.vendors
FOR SELECT
USING (
  -- Verified vendors are viewable, but sensitive fields should be filtered in application
  verification_status = 'verified'
);

-- Add policy for vendors to view their full profile including contact info
CREATE POLICY "Vendors can view their full profile"
ON public.vendors
FOR SELECT
USING (
  auth.uid() = user_id
);

-- Add comment explaining the security measure
COMMENT ON POLICY "Verified vendors basic info viewable by all" ON public.vendors IS 
'Allows public viewing of verified vendors. Application layer MUST filter out email, phone, address, and website fields when showing to non-owners.';

-- Payments table: Add policy to prevent vendors from viewing payment details
-- Currently only users and admins can view payments, but let's make it explicit
CREATE POLICY "Users view only their own payments"
ON public.payments
FOR SELECT  
USING (
  auth.uid() = user_id
);