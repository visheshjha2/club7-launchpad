import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const items = [
  { label: 'Payment Gateway (UPI/Net Banking)', done: false, note: 'Provide payment gateway credentials to enable online payments' },
  { label: 'SMTP Email Configuration', done: false, note: 'Set up email service for order confirmations and alerts' },
  { label: 'Hero Images', done: false, note: 'Upload custom hero images for the homepage' },
  { label: 'Products Added', done: false, note: 'Add your footwear products with images, sizes, and colors' },
];

export default function AdminSettings() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Settings & Setup</h1>
      
      <div className="p-6 bg-card border border-border rounded-lg mb-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Setup Checklist
        </h2>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              {item.done ? <CheckCircle2 className="h-5 w-5 text-success mt-0.5" /> : <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mt-0.5" />}
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="font-display text-lg font-semibold mb-4">Store Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Admin Email</span><span>abuzargw@gmail.com</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Admin Phone</span><span>+91 9027776771</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span>INR (₹)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">COD Status</span><span className="text-destructive">Disabled</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">UPI/Net Banking</span><span className="text-warning">Pending Setup</span></div>
        </div>
      </div>
    </div>
  );
}
