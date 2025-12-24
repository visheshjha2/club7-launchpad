import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0]?.image_url || '/placeholder.svg';
  const discount = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover-lift">
        {/* Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
            {discount}% OFF
          </div>
        )}

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Available Colors Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center space-x-1 pt-1">
              {[...new Set(product.variants.map(v => v.color_hex || '#666'))].slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
              {[...new Set(product.variants.map(v => v.color_hex))].length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{[...new Set(product.variants.map(v => v.color_hex))].length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
