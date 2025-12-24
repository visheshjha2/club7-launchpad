import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { generateSlug } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminProductForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', compare_at_price: '', is_featured: false, is_active: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('products').insert({
      name: form.name,
      slug: generateSlug(form.name),
      description: form.description,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      is_featured: form.is_featured,
      is_active: form.is_active,
    });

    if (error) toast.error('Failed to create product');
    else { toast.success('Product created! Add images and variants from edit page.'); navigate('/admin/products'); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card border border-border rounded-lg">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price (₹) *</Label>
            <Input type="number" value={form.price} onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label>Compare Price (₹)</Label>
            <Input type="number" value={form.compare_at_price} onChange={(e) => setForm(p => ({ ...p, compare_at_price: e.target.value }))} />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm(p => ({ ...p, is_featured: v }))} /><Label>Featured</Label></div>
          <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
        </div>
        <div className="flex gap-4">
          <Button type="submit" variant="gold" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Product'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
