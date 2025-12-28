import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { Package, ChevronRight, ShoppingBag, CheckCircle, XCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

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

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      // Only delete orders that are delivered or completed
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('user_id', user?.id)
        .in('status', ['delivered', 'completed']);

      if (error) throw error;

      toast.success('Order history cleared successfully!');
      fetchOrders();
    } catch (error: any) {
      console.error('Clear history error:', error);
      toast.error('Failed to clear order history');
    } finally {
      setClearing(false);
    }
  };

  const completedOrdersCount = orders.filter(
    o => ['delivered', 'completed'].includes(o.status.toLowerCase())
  ).length;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'text-success bg-success/10';
      case 'shipped':
      case 'packed':
        return 'text-primary bg-primary/10';
      case 'processing':
        return 'text-warning bg-warning/10';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getPaymentStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          color: 'text-success bg-success/10',
          icon: CheckCircle,
          label: 'Payment Approved'
        };
      case 'rejected':
        return {
          color: 'text-destructive bg-destructive/10',
          icon: XCircle,
          label: 'Payment Rejected'
        };
      case 'pending':
        return {
          color: 'text-warning bg-warning/10',
          icon: Clock,
          label: 'Payment Pending'
        };
      default:
        return {
          color: 'text-muted-foreground bg-muted',
          icon: AlertCircle,
          label: status
        };
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              My <span className="text-gradient-gold">Orders</span>
            </h1>
            
            {completedOrdersCount > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                    <Trash2 className="h-4 w-4" />
                    Clear History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Order History?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove {completedOrdersCount} delivered/completed order(s) from your history.
                      <br /><br />
                      <strong className="text-foreground">Pending and processing orders will NOT be affected.</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearHistory}
                      disabled={clearing}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {clearing ? 'Clearing...' : 'Yes, Clear History'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

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
              {orders.map((order) => {
                const paymentInfo = getPaymentStatusInfo(order.payment_status);
                const PaymentIcon = paymentInfo.icon;
                
                return (
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

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Order Status */}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        
                        {/* Payment Status with Icon */}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1.5 ${paymentInfo.color}`}>
                          <PaymentIcon className="h-4 w-4" />
                          {paymentInfo.label}
                        </span>
                        
                        <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                      </div>
                    </div>

                    {/* Payment Status Message */}
                    {order.payment_status === 'pending' && (
                      <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20 text-sm">
                        <p className="text-warning flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Your payment is being verified. We'll update the status soon.
                        </p>
                      </div>
                    )}
                    
                    {order.payment_status === 'approved' && (
                      <div className="mt-4 p-3 rounded-lg bg-success/5 border border-success/20 text-sm">
                        <p className="text-success flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Payment verified! Your order is being processed.
                        </p>
                      </div>
                    )}
                    
                    {order.payment_status === 'rejected' && (
                      <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm">
                        <p className="text-destructive flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Payment could not be verified. Please contact support.
                        </p>
                      </div>
                    )}

                    {/* Order Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border flex gap-2 overflow-x-auto">
                        {order.items.slice(0, 4).map((item) => (
                          <div key={item.id} className="flex-shrink-0">
                            <div className="w-16 h-16 rounded bg-muted relative">
                              {item.product_image && (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover rounded"
                                />
                              )}
                              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {item.quantity}
                              </span>
                            </div>
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
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
