import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8);

    if (!error && data) {
      setProducts(data as unknown as Product[]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg animate-shimmer" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            Featured <span className="text-gradient-gold">Collection</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Our featured products will appear here once products are added.
          </p>
          <div className="p-12 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">
              No featured products yet. Admin can add products from the admin panel.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              Featured <span className="text-gradient-gold">Collection</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              Handpicked selections from our premium range
            </p>
          </div>
          <Link to="/shop">
            <Button variant="gold-outline">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
