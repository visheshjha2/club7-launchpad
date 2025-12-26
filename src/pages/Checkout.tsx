import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Banknote, Smartphone, Copy, CheckCircle2 } from 'lucide-react';

const BANK_DETAILS = {
  accountHolder: 'Haji Ashraf',
  bankName: 'ICICI Bank',
  accountNumber: '105005001234',
  ifscCode: 'ICIC0001050',
  upiId: '8630105022@ibl'
};

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank'>('upi');
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: user?.email || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const shippingCost = subtotal >= 2999 ? 0 : 99;
  const total = subtotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate form
    const required = ['full_name', 'phone', 'email', 'address_line1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in all required fields`);
        return;
      }
    }

    // Validate phone
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_number: 'TEMP',
          status: 'pending',
          subtotal,
          shipping_cost: shippingCost,
          total,
          payment_status: 'pending',
          payment_method: paymentMethod === 'upi' ? 'UPI' : 'Bank Transfer',
          shipping_name: formData.full_name,
          shipping_phone: formData.phone,
          shipping_email: formData.email,
          shipping_address: `${formData.address_line1}${formData.address_line2 ? ', ' + formData.address_line2 : ''}`,
          shipping_city: formData.city,
          shipping_state: formData.state,
          shipping_pincode: formData.pincode,
          notes: formData.notes || null,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_image: item.product.images?.[0]?.image_url || null,
        size: item.variant.size,
        color: item.variant.color,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Navigate to success page
      navigate(`/order-success/${order.id}`);
      toast.success('Order placed! Please complete payment using the details provided.');

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Club7overseas</title>
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-display text-3xl font-bold mb-8">
            <span className="text-gradient-gold">Checkout</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h2 className="font-display text-xl font-semibold mb-6">Shipping Address</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address_line1">Address Line 1 *</Label>
                      <Input
                        id="address_line1"
                        name="address_line1"
                        placeholder="House/Flat No., Building Name, Street"
                        value={formData.address_line1}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input
                        id="address_line2"
                        name="address_line2"
                        placeholder="Landmark, Area (optional)"
                        value={formData.address_line2}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Any special instructions..."
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h2 className="font-display text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <div className="space-y-4">
                    {/* Payment Options */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                          paymentMethod === 'upi' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-xs text-muted-foreground">Pay via any UPI app</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                          paymentMethod === 'bank' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Banknote className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-xs text-muted-foreground">NEFT / IMPS / RTGS</p>
                        </div>
                      </button>
                    </div>

                    {/* UPI Details */}
                    {paymentMethod === 'upi' && (
                      <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                        <p className="text-sm font-medium">UPI ID</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-3 rounded bg-background border border-border font-mono text-lg">
                            {BANK_DETAILS.upiId}
                          </code>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(BANK_DETAILS.upiId, 'upi')}
                          >
                            {copied === 'upi' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pay using PhonePe, Google Pay, Paytm, or any UPI app
                        </p>
                      </div>
                    )}

                    {/* Bank Details */}
                    {paymentMethod === 'bank' && (
                      <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                        <div className="grid gap-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Account Holder</span>
                            <span className="font-medium">{BANK_DETAILS.accountHolder}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Bank Name</span>
                            <span className="font-medium">{BANK_DETAILS.bankName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{BANK_DETAILS.accountNumber}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'account')}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {copied === 'account' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">IFSC Code</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{BANK_DETAILS.ifscCode}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(BANK_DETAILS.ifscCode, 'ifsc')}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {copied === 'ifsc' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                      After placing your order, complete the payment and your order will be processed once payment is verified.
                      <br /><span className="text-destructive">Note: Cash on Delivery (COD) is not available.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="p-6 rounded-lg bg-card border border-border sticky top-24">
                  <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                  
                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 text-sm">
                        <div className="w-12 h-12 rounded bg-muted flex-shrink-0">
                          <img
                            src={item.product.images?.[0]?.image_url || '/placeholder.svg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.product.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {item.variant.color} / {item.variant.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t border-border pt-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-3 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
