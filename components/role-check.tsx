import React, { Suspense } from 'react';

import { getJwt } from '@/lib/actions/auth';

export async function RoleCheck({
  children,
  fallback,
  role,
}: {
  children: React.ReactNode;
  fallback: React.JSX.Element;
  role: string;
}) {
  const jwtToken = await getJwt();

  return (
    <Suspense fallback={fallback}>
      {jwtToken.roles.includes(role) ? children : null}
    </Suspense>
  );
}
