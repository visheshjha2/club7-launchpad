import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, ShoppingCart, Mail, TrendingUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, revenue: 0, messages: 0 });
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [{ count: products }, { count: orders }, { data: orderData }, { count: messages }] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total, status'),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    ]);
    
    const pending = orderData?.filter(o => o.status === 'pending').length || 0;
    const revenue = orderData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
    
    setStats({ 
      products: products || 0, 
      orders: orders || 0, 
      pending, 
      revenue,
      messages: messages || 0 
    });
  };

  const handleResetDashboard = async () => {
    setResetting(true);
    try {
      // Delete all orders and their items (cascade will handle order_items)
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (ordersError) throw ordersError;

      // Delete all contact messages
      const { error: messagesError } = await supabase
        .from('contact_messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (messagesError) throw messagesError;

      toast.success('Dashboard reset successfully! Orders and messages cleared.');
      fetchStats();
    } catch (error: any) {
      console.error('Reset error:', error);
      toast.error('Failed to reset dashboard: ' + error.message);
    } finally {
      setResetting(false);
    }
  };

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-primary' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-success' },
    { label: 'Pending Orders', value: stats.pending, icon: ShoppingCart, color: 'text-warning' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
    { label: 'Messages', value: stats.messages, icon: Mail, color: 'text-muted-foreground' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset Dashboard
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Dashboard?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all orders and contact messages. 
                <strong className="text-foreground"> Products will NOT be affected.</strong>
                <br /><br />
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleResetDashboard}
                disabled={resetting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset Dashboard'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="p-6 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`h-8 w-8 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
