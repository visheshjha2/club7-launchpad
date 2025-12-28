import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, Package, Truck, Check, Clock, CreditCard } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  payment_method: string | null;
  payment_screenshot_url: string | null;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'processing', label: 'Processing', icon: Package },
  { value: 'packed', label: 'Packed', icon: Package },
  { value: 'shipped', label: 'Shipped', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: Check },
  { value: 'completed', label: 'Completed', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`*, items:order_items(*)`)
      .order('created_at', { ascending: false });
    if (data) setOrders(data as unknown as Order[]);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update status');
      return;
    }

    toast.success(`Order status updated to ${status}`);
    fetchOrders();
  };

  const approvePayment = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'approved' })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to approve payment');
      return;
    }

    toast.success('Payment approved successfully');
    fetchOrders();
  };

  const rejectPayment = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'rejected' })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to reject payment');
      return;
    }

    toast.success('Payment rejected');
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { 
      delivered: 'bg-success/10 text-success', 
      completed: 'bg-success/10 text-success',
      shipped: 'bg-primary/10 text-primary', 
      packed: 'bg-primary/10 text-primary',
      processing: 'bg-warning/10 text-warning', 
      pending: 'bg-muted text-muted-foreground',
      cancelled: 'bg-destructive/10 text-destructive',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-destructive/10 text-destructive',
    };
    return colors[status.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const viewPaymentScreenshot = (order: Order) => {
    setSelectedOrder(order);
    setShowScreenshot(true);
  };

  const getTotalQuantity = (order: Order) => {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Orders</h1>
      
      {loading ? (
        <div className="h-48 animate-shimmer rounded-lg" />
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 rounded-lg bg-card border border-border">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-medium">{order.order_number}</span>
                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${getStatusColor(order.payment_status)}`}>
                      Payment: {order.payment_status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{order.shipping_name}</span>
                    <span className="mx-2">•</span>
                    <span>{order.shipping_phone}</span>
                    <span className="mx-2">•</span>
                    <span>{format(new Date(order.created_at), 'PPp')}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                    <span className="text-muted-foreground">
                      {getTotalQuantity(order)} item(s)
                    </span>
                    {order.payment_method && (
                      <span className="text-muted-foreground">
                        via {order.payment_method}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* View Details */}
                  <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>

                  {/* View Payment Screenshot */}
                  {order.payment_screenshot_url && (
                    <Button variant="outline" size="sm" onClick={() => viewPaymentScreenshot(order)}>
                      <CreditCard className="h-4 w-4 mr-1" />
                      Screenshot
                    </Button>
                  )}

                  {/* Approve/Reject Payment */}
                  {order.payment_status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => approvePayment(order.id)}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => rejectPayment(order.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}

                  {/* Status Dropdown */}
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <status.icon className="h-4 w-4" />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Order Items Preview */}
              {order.items && order.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border overflow-x-auto">
                  <table className="w-full text-sm min-w-[400px]">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="text-left py-1">Product</th>
                        <th className="text-left py-1">Variant</th>
                        <th className="text-center py-1">Qty</th>
                        <th className="text-right py-1">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-t border-border/50">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              {item.product_image && (
                                <img 
                                  src={item.product_image} 
                                  alt={item.product_name} 
                                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                                />
                              )}
                              <span className="truncate max-w-[120px] sm:max-w-[200px]">{item.product_name}</span>
                            </div>
                          </td>
                          <td className="py-2 text-muted-foreground whitespace-nowrap">
                            {item.color} / {item.size}
                          </td>
                          <td className="py-2 text-center font-medium">{item.quantity}</td>
                          <td className="py-2 text-right whitespace-nowrap">{formatPrice(item.total_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shipping_name}<br />
                    {selectedOrder.shipping_phone}<br />
                    {selectedOrder.shipping_email}<br />
                    {selectedOrder.shipping_address}<br />
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_pincode}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Order Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Screenshot Dialog */}
      <Dialog open={showScreenshot} onOpenChange={setShowScreenshot}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
          </DialogHeader>
          {selectedOrder?.payment_screenshot_url && (
            <div>
              <img 
                src={selectedOrder.payment_screenshot_url} 
                alt="Payment Screenshot" 
                className="w-full rounded-lg"
              />
              <div className="mt-4 flex gap-2">
                <Button 
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={() => {
                    approvePayment(selectedOrder.id);
                    setShowScreenshot(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Payment
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    rejectPayment(selectedOrder.id);
                    setShowScreenshot(false);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
