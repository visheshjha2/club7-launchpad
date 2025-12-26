import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Package, ArrowRight, Copy, CheckCircle2, Banknote, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const BANK_DETAILS = {
  accountHolder: 'Haji Ashraf',
  bankName: 'ICICI Bank',
  accountNumber: '105005001234',
  ifscCode: 'ICIC0001050',
  upiId: '8630105022@ibl'
};

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
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
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>

              <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                Order <span className="text-gradient-gold">Confirmed!</span>
              </h1>
              
              <p className="text-muted-foreground">
                Thank you for your order. Please complete the payment to process your order.
              </p>
            </div>

            {order && (
              <>
                {/* Order Details */}
                <div className="p-6 rounded-lg bg-card border border-border mb-6">
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
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="capitalize">{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span className={`capitalize ${order.payment_status === 'pending' ? 'text-warning' : 'text-success'}`}>
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping To</span>
                      <span className="text-right max-w-[60%]">
                        {order.shipping_name}, {order.shipping_city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                {order.payment_status === 'pending' && (
                  <div className="p-6 rounded-lg bg-warning/10 border border-warning/30 mb-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-warning" />
                      Complete Your Payment
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Please transfer <span className="font-semibold text-foreground">{formatPrice(order.total)}</span> using one of the methods below:
                    </p>

                    {/* UPI */}
                    <div className="p-4 rounded-lg bg-background border border-border mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">UPI Payment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 rounded bg-muted font-mono text-sm">
                          {BANK_DETAILS.upiId}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(BANK_DETAILS.upiId, 'upi')}
                        >
                          {copied === 'upi' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div className="p-4 rounded-lg bg-background border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Banknote className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Bank Transfer (NEFT/IMPS/RTGS)</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Holder</span>
                          <span>{BANK_DETAILS.accountHolder}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank</span>
                          <span>{BANK_DETAILS.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">A/C Number</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{BANK_DETAILS.accountNumber}</span>
                            <button onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'account')}>
                              {copied === 'account' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">IFSC Code</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{BANK_DETAILS.ifscCode}</span>
                            <button onClick={() => copyToClipboard(BANK_DETAILS.ifscCode, 'ifsc')}>
                              {copied === 'ifsc' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">
                      Your order will be processed once payment is verified by our team (usually within 2-4 hours).
                    </p>
                  </div>
                )}
              </>
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
