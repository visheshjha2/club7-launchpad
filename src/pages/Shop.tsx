import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('is_active', true);

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'name':
        query = query.order('name');
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (!error && data) {
      setProducts(data as unknown as Product[]);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Shop Premium Footwear | Club7overseas</title>
        <meta name="description" content="Browse our complete collection of premium footwear. Find luxury shoes, sneakers, and more at Club7overseas." />
      </Helmet>

      <Layout>
        {/* Header */}
        <section className="py-12 lg:py-16 bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-2">
              Shop <span className="text-gradient-gold">Collection</span>
            </h1>
            <p className="text-muted-foreground">
              Discover our complete range of premium footwear
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-background border-b border-border sticky top-16 lg:top-20 z-40">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 lg:py-16 bg-background min-h-[60vh]">
          <div className="container mx-auto px-4 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg animate-shimmer" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <SlidersHorizontal className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  {search ? 'Try a different search term' : 'Products will appear here once added by admin'}
                </p>
                {search && (
                  <Button variant="outline" onClick={() => setSearch('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-6">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div 
                      key={product.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
