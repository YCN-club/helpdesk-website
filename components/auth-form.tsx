'use client';

import { CircleNotch, MicrosoftOutlookLogo } from '@phosphor-icons/react';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Button type="button" disabled={isLoading} onClick={onSubmit}>
        {isLoading ? (
          <CircleNotch className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <MicrosoftOutlookLogo className="mr-2 h-5 w-5" />
        )}{' '}
        Login with Outlook
      </Button>
    </div>
  );
}
