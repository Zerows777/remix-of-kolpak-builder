ALTER TABLE public.portfolio_categories
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS icon text DEFAULT 'FileText',
  ADD COLUMN IF NOT EXISTS items text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS show_in_catalog boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS slug text;