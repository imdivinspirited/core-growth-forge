-- Drop the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new policy that respects privacy settings
-- Users can always view their own complete profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Public profiles can be viewed by everyone, but with limited information
-- Only show non-sensitive fields for public profiles
CREATE POLICY "Public profiles are viewable with limited info"
ON public.profiles
FOR SELECT
USING (
  privacy_profile = 'public' 
  AND auth.uid() != user_id
);

-- Note: When querying public profiles from the client, 
-- you should select only non-sensitive columns:
-- SELECT id, user_id, username, full_name, bio, avatar_url, cover_photo_url
-- DO NOT select: email, phone for other users' profiles