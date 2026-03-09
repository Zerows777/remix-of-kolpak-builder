-- Создаем таблицу категорий портфолио
CREATE TABLE public.portfolio_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;

-- Разрешаем всем читать категории
CREATE POLICY "Anyone can view categories"
ON public.portfolio_categories
FOR SELECT
USING (true);

-- Разрешаем всем добавлять/обновлять/удалять категории
CREATE POLICY "Anyone can insert categories"
ON public.portfolio_categories
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
ON public.portfolio_categories
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete categories"
ON public.portfolio_categories
FOR DELETE
USING (true);

-- Вставляем начальные категории
INSERT INTO public.portfolio_categories (name, sort_order) VALUES
  ('Кровля', 1),
  ('Интерьер', 2),
  ('Ограждения', 3),
  ('Водостоки', 4),
  ('Декор', 5);

-- Также добавляем политики UPDATE и DELETE для portfolio_projects и portfolio_images
CREATE POLICY "Anyone can update projects"
ON public.portfolio_projects
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete projects"
ON public.portfolio_projects
FOR DELETE
USING (true);

CREATE POLICY "Anyone can update portfolio images"
ON public.portfolio_images
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete portfolio images"
ON public.portfolio_images
FOR DELETE
USING (true);