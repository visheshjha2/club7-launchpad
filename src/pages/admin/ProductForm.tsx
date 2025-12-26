import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateSlug } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Upload, X, Plus, Trash2 } from 'lucide-react';
import { Category } from '@/types';

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  color_hex: string;
  stock_quantity: number;
}

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<{ id?: string; url: string; file?: File }[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([
    { size: '', color: '', color_hex: '#000000', stock_quantity: 0 }
  ]);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compare_at_price: '',
    category_id: '',
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchProduct = async () => {
    if (!id) return;
    
    const { data: product } = await supabase
      .from('products')
      .select('*, product_images(*), product_variants(*)')
      .eq('id', id)
      .single();
    
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        compare_at_price: product.compare_at_price?.toString() || '',
        category_id: product.category_id || '',
        is_featured: product.is_featured,
        is_active: product.is_active
      });
      
      if (product.product_images) {
        setImages(product.product_images.map((img: any) => ({ id: img.id, url: img.image_url })));
      }
      
      if (product.product_variants && product.product_variants.length > 0) {
        setVariants(product.product_variants.map((v: any) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          color_hex: v.color_hex || '#000000',
          stock_quantity: v.stock_quantity
        })));
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: { url: string; file: File }[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (!error) {
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        newImages.push({ url: urlData.publicUrl, file });
      } else {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setUploading(false);
    toast.success(`${newImages.length} image(s) uploaded`);
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    
    if (image.id) {
      await supabase.from('product_images').delete().eq('id', image.id);
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { size: '', color: '', color_hex: '#000000', stock_quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      toast.error('At least one variant is required');
      return;
    }
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }

    if (variants.some(v => !v.size || !v.color)) {
      toast.error('All variants must have size and color');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: form.name,
        slug: generateSlug(form.name),
        description: form.description || null,
        price: parseFloat(form.price),
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        category_id: form.category_id || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
      };

      let productId = id;

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        
        if (error) throw error;
        productId = data.id;
      }

      // Save images
      const newImages = images.filter(img => !img.id);
      if (newImages.length > 0) {
        const imageInserts = newImages.map((img, index) => ({
          product_id: productId,
          image_url: img.url,
          display_order: images.indexOf(img)
        }));
        
        await supabase.from('product_images').insert(imageInserts);
      }

      // Save variants
      if (isEditing) {
        // Delete removed variants
        const existingVariantIds = variants.filter(v => v.id).map(v => v.id);
        await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', productId)
          .not('id', 'in', `(${existingVariantIds.join(',')})`);
      }

      for (const variant of variants) {
        const variantData = {
          product_id: productId,
          size: variant.size,
          color: variant.color,
          color_hex: variant.color_hex,
          stock_quantity: variant.stock_quantity
        };

        if (variant.id) {
          await supabase
            .from('product_variants')
            .update(variantData)
            .eq('id', variant.id);
        } else {
          await supabase
            .from('product_variants')
            .insert(variantData);
        }
      }

      toast.success(isEditing ? 'Product updated!' : 'Product created!');
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const sizes = ['6', '7', '8', '9', '10', '11', '12'];

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold mb-6">
        {isEditing ? 'Edit Product' : 'Add Product'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h2 className="font-display text-lg font-semibold">Basic Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} 
                placeholder="Product name"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm(p => ({ ...p, category_id: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={form.description} 
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} 
              rows={4}
              placeholder="Product description..."
            />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹) *</Label>
              <Input 
                type="number" 
                value={form.price} 
                onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))} 
                placeholder="0"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Compare at Price (₹)</Label>
              <Input 
                type="number" 
                value={form.compare_at_price} 
                onChange={(e) => setForm(p => ({ ...p, compare_at_price: e.target.value }))}
                placeholder="Original price for discount display"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch 
                checked={form.is_featured} 
                onCheckedChange={(v) => setForm(p => ({ ...p, is_featured: v }))} 
              />
              <Label>Featured Product</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={form.is_active} 
                onCheckedChange={(v) => setForm(p => ({ ...p, is_active: v }))} 
              />
              <Label>Active</Label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h2 className="font-display text-lg font-semibold">Product Images</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Variants */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Variants (Size & Color)</h2>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-1" /> Add Variant
            </Button>
          </div>
          
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-muted/50 rounded-lg">
                <div className="col-span-3 space-y-2">
                  <Label className="text-xs">Size</Label>
                  <Select value={variant.size} onValueChange={(v) => updateVariant(index, 'size', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label className="text-xs">Color Name</Label>
                  <Input 
                    value={variant.color}
                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                    placeholder="Black"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-xs">Color</Label>
                  <Input 
                    type="color"
                    value={variant.color_hex}
                    onChange={(e) => updateVariant(index, 'color_hex', e.target.value)}
                    className="h-10 p-1"
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label className="text-xs">Stock</Label>
                  <Input 
                    type="number"
                    value={variant.stock_quantity}
                    onChange={(e) => updateVariant(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="col-span-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeVariant(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" variant="gold" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
