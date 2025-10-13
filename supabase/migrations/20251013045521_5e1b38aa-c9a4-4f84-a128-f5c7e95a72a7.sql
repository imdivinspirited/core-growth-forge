-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public can view verified vendors" ON public.vendors;

-- Create a new policy that requires authentication for full vendor details
CREATE POLICY "Authenticated users can view verified vendors"
ON public.vendors
FOR SELECT
TO authenticated
USING (
  verification_status = 'verified' 
  OR auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin')
);

-- Create a policy for unauthenticated users that only exposes non-sensitive fields
-- This is done by creating a view or using the existing get_public_vendor_info function
-- For now, we'll restrict unauthenticated access entirely to protect contact info
-- Applications should use get_public_vendor_info() function for public vendor listings

-- Add a policy for users with active bookings to view vendor contact details
CREATE POLICY "Users with bookings can view vendor contact"
ON public.vendors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.vendor_id = vendors.id
    AND bookings.user_id = auth.uid()
  )
  OR auth.uid() = user_id
  OR has_role(auth.uid(), 'admin')
);