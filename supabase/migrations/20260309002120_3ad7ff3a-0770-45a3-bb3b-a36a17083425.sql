-- Simplify portfolio_projects table by making is_published default to true
-- and simplifying the structure

ALTER TABLE public.portfolio_projects 
ALTER COLUMN is_published SET DEFAULT true;

-- Update existing projects to be published by default
UPDATE public.portfolio_projects 
SET is_published = true 
WHERE is_published IS NULL OR is_published = false;

-- Simplify RLS policies to make them less restrictive for a simple portfolio
DROP POLICY IF EXISTS "Authenticated can view published projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public can view published projects" ON public.portfolio_projects;

-- Create new simpler policies - everyone can view published projects
CREATE POLICY "Anyone can view published projects" 
ON public.portfolio_projects 
FOR SELECT 
USING (is_published = true);

-- Keep admin management policy
-- (Already exists: "Admins can manage all projects")