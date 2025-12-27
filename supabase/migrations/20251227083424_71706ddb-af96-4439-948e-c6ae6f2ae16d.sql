-- Super admin / owner helper (email-based, no roles required)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'abuzargw@gmail.com';
$$;

-- Update admin RLS policies to allow super admin email

-- Categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Products
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Product Images
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
CREATE POLICY "Admins can manage product images"
ON public.product_images
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Product Variants
DROP POLICY IF EXISTS "Admins can manage variants" ON public.product_variants;
CREATE POLICY "Admins can manage variants"
ON public.product_variants
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Achievements
DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
CREATE POLICY "Admins can manage achievements"
ON public.achievements
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Orders
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Order Items
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items"
ON public.order_items
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Addresses (admin read)
DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
CREATE POLICY "Admins can view all addresses"
ON public.addresses
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Contact messages (admin manage)
DROP POLICY IF EXISTS "Admins can view messages" ON public.contact_messages;
CREATE POLICY "Admins can view messages"
ON public.contact_messages
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Site settings (admin manage)
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings"
ON public.site_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin());

-- Storage policies for image uploads (owner email should be allowed)
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id IN ('product-images', 'achievements', 'hero-images')
  AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
);

CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id IN ('product-images', 'achievements', 'hero-images')
  AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
)
WITH CHECK (
  bucket_id IN ('product-images', 'achievements', 'hero-images')
  AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
);

CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id IN ('product-images', 'achievements', 'hero-images')
  AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.is_super_admin())
);
