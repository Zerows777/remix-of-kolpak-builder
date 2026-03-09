-- Сначала удаляем все политики RLS, которые зависят от has_role функции
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage all images" ON public.portfolio_images;
DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;

-- Теперь можем удалить функцию и связанные объекты
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Удаляем таблицу ролей пользователей
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Удаляем тип enum для ролей
DROP TYPE IF EXISTS public.app_role CASCADE;