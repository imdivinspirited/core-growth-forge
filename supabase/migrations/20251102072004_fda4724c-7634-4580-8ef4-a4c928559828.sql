-- Update the app_role enum to include new roles if they don't exist
DO $$ 
BEGIN
  -- Add 'student' if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'student' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'student';
  END IF;
  
  -- Add 'professional' if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'professional' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'professional';
  END IF;
END $$;

-- Update the user_roles table default to allow all roles
ALTER TABLE public.user_roles 
ALTER COLUMN role DROP DEFAULT;

ALTER TABLE public.user_roles 
ALTER COLUMN role SET DEFAULT 'user'::app_role;