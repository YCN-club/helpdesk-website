'use client';

import React, { useEffect, useState } from 'react';

import { getJwt } from '@/lib/actions/auth';

export function RoleCheck({
  children,
  fallback,
  role,
}: {
  children: React.ReactNode;
  fallback: React.JSX.Element;
  role: string;
}) {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const jwtToken = await getJwt();
        setRoles(jwtToken.roles);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return fallback;
  }

  return roles.includes(role) ? children : null;
}
