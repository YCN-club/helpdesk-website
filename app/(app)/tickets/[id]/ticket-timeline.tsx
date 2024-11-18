'use client';

import { useEffect, useRef } from 'react';

import { Message } from '@/types';

export function TicketTimeline({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId: string | null;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  return (
    <div className="flex-grow overflow-y-auto">
      <div className="space-y-4 p-4">
        {[...messages].reverse().map((message) => (
          <div key={message.id}>
            {message.type === 'SYSTEM' ? (
              <SystemMessage message={message} />
            ) : (
              <UserMessage
                message={message}
                isCurrentUser={message.author.id === currentUserId}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function UserMessage({
  message,
  isCurrentUser,
}: {
  message: Message;
  isCurrentUser: boolean;
}) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
          isCurrentUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        <p>{message.content}</p>
        <span className="text-xs text-muted-foreground">
          {new Date(message.created_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function SystemMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-center">
      <div className="max-w-[75%] rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
        {message.content}
      </div>
    </div>
  );
}
