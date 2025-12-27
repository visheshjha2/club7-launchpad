-- Add payment_screenshot_url column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;

-- Create payment-screenshots storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload payment screenshots for their orders
CREATE POLICY "Users can upload payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-screenshots' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to view their own payment screenshots
CREATE POLICY "Users can view own payment screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-screenshots' 
  AND auth.uid() IS NOT NULL
);

-- Allow admins to view all payment screenshots
CREATE POLICY "Admins can view all payment screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-screenshots' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR is_super_admin())
);

-- Allow admins to manage payment screenshots
CREATE POLICY "Admins can manage payment screenshots"
ON storage.objects FOR ALL
USING (
  bucket_id = 'payment-screenshots' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR is_super_admin())
);

-- Update orders table RLS to allow users to update their own orders (for payment screenshot)
CREATE POLICY "Users can update own orders payment screenshot"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);