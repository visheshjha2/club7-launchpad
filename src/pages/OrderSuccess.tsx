import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (!error && data) {
      setOrder(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <div className="h-16 w-16 rounded-full animate-shimmer mx-auto mb-4" />
          <div className="h-8 w-64 rounded animate-shimmer mx-auto" />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Club7overseas</title>
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Order <span className="text-gradient-gold">Confirmed!</span>
            </h1>
            
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>

            {order && (
              <div className="p-6 rounded-lg bg-card border border-border text-left mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Order Details</h2>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number</span>
                    <span className="font-mono font-medium">{order.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span className="capitalize">{order.payment_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping To</span>
                    <span className="text-right max-w-[60%]">
                      {order.shipping_name}, {order.shipping_city}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/orders">
                <Button variant="gold">
                  View Order History
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="gold-outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
