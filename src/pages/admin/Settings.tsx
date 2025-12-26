import { CheckCircle2, Info } from 'lucide-react';

const items = [
  { label: 'Payment Gateway (UPI/Net Banking)', done: true, note: 'Manual bank transfer and UPI configured' },
  { label: 'Hero Images', done: false, note: 'Optional: Upload custom hero images for the homepage' },
  { label: 'Products Added', done: false, note: 'Add your footwear products with images, sizes, and colors' },
];

export default function AdminSettings() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Settings & Setup</h1>
      
      <div className="p-6 bg-card border border-border rounded-lg mb-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Setup Checklist (Informational)
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          This checklist helps track setup progress. All admin features work regardless of completion status.
        </p>
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

      <div className="p-6 bg-card border border-border rounded-lg mb-6">
        <h2 className="font-display text-lg font-semibold mb-4">Payment Configuration</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Payment Mode</span><span className="text-success">Manual Bank Transfer + UPI</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Account Holder</span><span>Haji Ashraf</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Bank Name</span><span>ICICI Bank</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Account Number</span><span>105005001234</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">IFSC Code</span><span>ICIC0001050</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">UPI ID</span><span>8630105022@ibl</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">COD Status</span><span className="text-destructive">Disabled</span></div>
        </div>
      </div>

      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="font-display text-lg font-semibold mb-4">Store Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Admin Email</span><span>abuzargw@gmail.com</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Admin Phone</span><span>+91 9027776771</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span>INR (₹)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Email Notifications</span><span className="text-muted-foreground">Not configured</span></div>
        </div>
      </div>
    </div>
  );
}
