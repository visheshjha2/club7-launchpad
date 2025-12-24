import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateSlug } from '@/lib/utils';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const add = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from('categories').insert({ name, slug: generateSlug(name) });
    if (error) toast.error('Failed'); else { toast.success('Added'); setName(''); fetch(); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetch();
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold mb-6">Categories</h1>
      <div className="flex gap-2 mb-6">
        <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <Button variant="gold" onClick={add}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <span>{cat.name}</span>
            <Button variant="ghost" size="icon" onClick={() => remove(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
