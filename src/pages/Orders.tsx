import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as unknown as Order[]);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-success bg-success/10';
      case 'shipped':
        return 'text-primary bg-primary/10';
      case 'processing':
        return 'text-warning bg-warning/10';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>My Orders | Club7overseas</title>
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-display text-3xl font-bold mb-8">
            My <span className="text-gradient-gold">Orders</span>
          </h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg animate-shimmer" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Link to="/shop">
                <Button variant="gold">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-muted-foreground mb-1">
                          {order.order_number}
                        </p>
                        <p className="font-semibold text-lg mb-1">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), 'PPP')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border flex gap-2 overflow-x-auto">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-16 h-16 rounded bg-muted">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 rounded bg-muted flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
