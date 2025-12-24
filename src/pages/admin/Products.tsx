import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*, images:product_images(*)').order('created_at', { ascending: false });
    if (data) setProducts(data as unknown as Product[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Product deleted'); fetchProducts(); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new"><Button variant="gold"><Plus className="h-4 w-4 mr-2" />Add Product</Button></Link>
      </div>

      {loading ? <div className="h-48 animate-shimmer rounded-lg" /> : products.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-lg text-center">
          <p className="text-muted-foreground mb-4">No products yet</p>
          <Link to="/admin/products/new"><Button variant="gold"><Plus className="h-4 w-4 mr-2" />Add Your First Product</Button></Link>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-muted">
                        {product.images?.[0] && <img src={product.images[0].image_url} className="w-full h-full object-cover rounded" />}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{formatPrice(product.price)}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${product.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{product.is_active ? 'Active' : 'Draft'}</span></td>
                  <td className="p-4 text-right">
                    <Link to={`/admin/products/${product.id}/edit`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
