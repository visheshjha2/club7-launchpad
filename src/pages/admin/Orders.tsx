import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { delivered: 'bg-success/10 text-success', shipped: 'bg-primary/10 text-primary', processing: 'bg-warning/10 text-warning', cancelled: 'bg-destructive/10 text-destructive' };
    return colors[status.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Orders</h1>
      {loading ? <div className="h-48 animate-shimmer rounded-lg" /> : orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted"><tr><th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Total</th><th className="text-left p-4">Status</th><th className="text-left p-4">Date</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="p-4 font-mono text-sm">{order.order_number}</td>
                  <td className="p-4">{order.shipping_name}<br /><span className="text-sm text-muted-foreground">{order.shipping_phone}</span></td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded text-xs capitalize ${getStatusColor(order.status)}`}>{order.status}</span></td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(order.created_at), 'PPp')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
