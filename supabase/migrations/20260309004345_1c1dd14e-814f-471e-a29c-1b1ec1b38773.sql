-- Создаем новые политики RLS для публичного доступа к добавлению проектов

-- Разрешаем всем добавлять проекты
CREATE POLICY "Anyone can insert projects" 
ON public.portfolio_projects 
FOR INSERT 
WITH CHECK (true);

-- Разрешаем всем добавлять изображения к проектам
CREATE POLICY "Anyone can insert portfolio images" 
ON public.portfolio_images 
FOR INSERT 
WITH CHECK (true);

-- Разрешаем загрузку изображений в bucket portfolio
CREATE POLICY "Anyone can upload to portfolio bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'portfolio');

-- Разрешаем всем просматривать изображения в portfolio bucket (для превью)
CREATE POLICY "Anyone can view portfolio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio');