import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { ShoppingBag, Heart, Minus, Plus, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    if (!slug) return;
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        category:categories(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      navigate('/shop');
      return;
    }

    setProduct(data as unknown as Product);
    
    // Set default selections
    if (data.variants?.length > 0) {
      const colors = [...new Set(data.variants.map((v: ProductVariant) => v.color))];
      const sizes = [...new Set(data.variants.map((v: ProductVariant) => v.size))];
      if (colors.length > 0) setSelectedColor(colors[0]);
      if (sizes.length > 0) setSelectedSize(sizes[0]);
    }
    
    setLoading(false);
  };

  const getAvailableSizes = () => {
    if (!product?.variants) return [];
    const sizes = product.variants
      .filter(v => !selectedColor || v.color === selectedColor)
      .map(v => v.size);
    return [...new Set(sizes)];
  };

  const getAvailableColors = () => {
    if (!product?.variants) return [];
    const colors = product.variants
      .filter(v => !selectedSize || v.size === selectedSize)
      .map(v => ({ color: v.color, hex: v.color_hex }));
    return [...new Map(colors.map(c => [c.color, c])).values()];
  };

  const getSelectedVariant = (): ProductVariant | undefined => {
    return product?.variants?.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }

    const variant = getSelectedVariant();
    if (!variant || !product) {
      toast.error('Please select size and color');
      return;
    }

    if (variant.stock_quantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    setAddingToCart(true);
    await addToCart(product.id, variant.id, quantity);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-lg animate-shimmer" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded animate-shimmer" />
              <div className="h-6 w-1/2 rounded animate-shimmer" />
              <div className="h-24 rounded animate-shimmer" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const discount = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;
  const selectedVariant = getSelectedVariant();

  return (
    <>
      <Helmet>
        <title>{product.name} | Club7overseas</title>
        <meta name="description" content={product.description || `Shop ${product.name} at Club7overseas`} />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-card border border-border">
                <img
                  src={images[selectedImage]?.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                      onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {discount > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground font-semibold rounded">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title & Price */}
              <div>
                {product.category && (
                  <p className="text-primary text-sm font-medium mb-2">
                    {product.category.name}
                  </p>
                )}
                <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Color Selection */}
              {getAvailableColors().length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Color: <span className="text-muted-foreground">{selectedColor}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableColors().map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setSelectedColor(c.color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === c.color 
                            ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' 
                            : 'border-border'
                        }`}
                        style={{ backgroundColor: c.hex || '#666' }}
                        title={c.color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {getAvailableSizes().length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Size: <span className="text-muted-foreground">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableSizes().map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedSize === size 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              {selectedVariant && (
                <p className={`text-sm font-medium ${
                  selectedVariant.stock_quantity > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {selectedVariant.stock_quantity > 0 
                    ? `${selectedVariant.stock_quantity} in stock` 
                    : 'Out of stock'}
                </p>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-medium mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={selectedVariant && quantity >= selectedVariant.stock_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="gold"
                  size="xl"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || selectedVariant.stock_quantity < 1 || addingToCart}
                >
                  Buy Now
                </Button>
                <Button
                  variant="gold-outline"
                  size="xl"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock_quantity < 1 || addingToCart}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Pan-India Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
