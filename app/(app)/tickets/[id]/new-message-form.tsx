'use client';

import { PaperPlaneRight } from '@phosphor-icons/react';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { addTicketMessage } from '@/lib/actions/tickets';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewMessageForm({ ticketId }: { ticketId: string }) {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await addTicketMessage(ticketId, message);
      setMessage('');
      router.refresh();
    } catch (error) {
      console.error('Failed to add message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button type="submit" size="icon" variant="secondary">
        <PaperPlaneRight weight="fill" className="size-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
