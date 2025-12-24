import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Loader2, Send } from 'lucide-react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('contact_messages').insert(formData);
    
    if (error) {
      toast.error('Failed to send message');
    } else {
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Club7overseas</title>
        <meta name="description" content="Get in touch with Club7overseas. We're here to help with your footwear needs." />
      </Helmet>

      <Layout>
        <section className="py-16 lg:py-24 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-display text-4xl font-bold text-center mb-4">
              Contact <span className="text-gradient-gold">Us</span>
            </h1>
            <p className="text-muted-foreground text-center">We'd love to hear from you</p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <h2 className="font-display text-2xl font-bold">Get In Touch</h2>
                <div className="space-y-6">
                  <a href="mailto:abuzargw@gmail.com" className="flex items-center gap-4 group">
                    <div className="p-3 rounded-lg bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
                    <span className="group-hover:text-primary">abuzargw@gmail.com</span>
                  </a>
                  <a href="tel:+919027776771" className="flex items-center gap-4 group">
                    <div className="p-3 rounded-lg bg-primary/10"><Phone className="h-5 w-5 text-primary" /></div>
                    <span className="group-hover:text-primary">+91 9027776771</span>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div>
                    <span>19/186-A/1 Saket Colony, Shahganj, Agra, India</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="p-6 rounded-lg bg-card border border-border space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={formData.subject} onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" rows={5} value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} required />
                </div>
                <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" />Send Message</>}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
