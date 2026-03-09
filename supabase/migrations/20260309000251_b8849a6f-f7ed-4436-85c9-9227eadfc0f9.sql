-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create portfolio_projects table
CREATE TABLE public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    location TEXT,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create portfolio_images table for gallery
CREATE TABLE public.portfolio_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on both tables
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- RLS policies for portfolio_projects
-- Admins can do everything
CREATE POLICY "Admins can manage all projects"
ON public.portfolio_projects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can view published projects
CREATE POLICY "Public can view published projects"
ON public.portfolio_projects
FOR SELECT
TO anon
USING (is_published = true);

CREATE POLICY "Authenticated can view published projects"
ON public.portfolio_projects
FOR SELECT
TO authenticated
USING (is_published = true);

-- RLS policies for portfolio_images
-- Admins can manage all images
CREATE POLICY "Admins can manage all images"
ON public.portfolio_images
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can view images of published projects
CREATE POLICY "Public can view images of published projects"
ON public.portfolio_images
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.portfolio_projects
    WHERE id = portfolio_images.project_id
    AND is_published = true
  )
);

CREATE POLICY "Authenticated can view images of published projects"
ON public.portfolio_images
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolio_projects
    WHERE id = portfolio_images.project_id
    AND is_published = true
  )
);

-- Storage policies for portfolio bucket
CREATE POLICY "Admins can upload portfolio images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update portfolio images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete portfolio images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Public can view portfolio images"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated can view portfolio images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'portfolio');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for portfolio_projects
CREATE TRIGGER update_portfolio_projects_updated_at
    BEFORE UPDATE ON public.portfolio_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();