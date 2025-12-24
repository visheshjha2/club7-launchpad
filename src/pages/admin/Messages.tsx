import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/types';
import { format } from 'date-fns';
import { Mail } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then(({ data }) => data && setMessages(data));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Contact Messages</h1>
      {messages.length === 0 ? <p className="text-muted-foreground text-center py-12">No messages yet</p> : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 bg-card border border-border rounded-lg">
              <div className="flex justify-between mb-2">
                <div><p className="font-medium">{msg.name}</p><p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{msg.email}</p></div>
                <p className="text-xs text-muted-foreground">{format(new Date(msg.created_at), 'PPp')}</p>
              </div>
              {msg.subject && <p className="font-medium mb-1">{msg.subject}</p>}
              <p className="text-muted-foreground">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
