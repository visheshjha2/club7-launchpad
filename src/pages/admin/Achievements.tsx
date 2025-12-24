import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminAchievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState({ title: '', description: '', year: '' });

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from('achievements').select('*').order('display_order');
    if (data) setItems(data);
  };

  const add = async () => {
    if (!form.title.trim()) return;
    const { error } = await supabase.from('achievements').insert(form);
    if (error) toast.error('Failed'); else { toast.success('Added'); setForm({ title: '', description: '', year: '' }); fetch(); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete?')) return;
    await supabase.from('achievements').delete().eq('id', id);
    fetch();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Achievements</h1>
      <div className="p-4 bg-card border border-border rounded-lg mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div><Label>Year</Label><Input value={form.year} onChange={(e) => setForm(p => ({ ...p, year: e.target.value }))} /></div>
        </div>
        <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
        <Button variant="gold" onClick={add}><Plus className="h-4 w-4 mr-2" />Add Achievement</Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.year}</p></div>
            <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
