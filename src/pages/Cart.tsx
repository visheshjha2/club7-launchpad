import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, loading, subtotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-4">Your Cart</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your cart</p>
          <Link to="/auth">
            <Button variant="gold">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg animate-shimmer" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart | Club7overseas</title>
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-display text-3xl font-bold mb-8">
            Shopping <span className="text-gradient-gold">Cart</span>
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Start shopping to add items</p>
              <Link to="/shop">
                <Button variant="gold">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-lg bg-card border border-border"
                  >
                    {/* Image */}
                    <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.product.images?.[0]?.image_url || '/placeholder.svg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.slug}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.variant.color} / {item.variant.size}
                      </p>
                      <p className="text-primary font-semibold mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center border border-border rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stock_quantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="p-6 rounded-lg bg-card border border-border sticky top-24">
                  <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{subtotal >= 2999 ? 'Free' : formatPrice(99)}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatPrice(subtotal + (subtotal >= 2999 ? 0 : 99))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  {subtotal < 2999 && (
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Add {formatPrice(2999 - subtotal)} more for free shipping
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
