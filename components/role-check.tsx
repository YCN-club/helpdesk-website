'use client';

import { decodeJwt } from 'jose';

import React, { useEffect, useState } from 'react';

type RoleCheckProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export function RoleCheck({ children, allowedRoles }: RoleCheckProps) {
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('JWT_TOKEN');
      if (!token) return;
      const decoded = decodeJwt(token) as { role?: string };
      if (decoded.role && allowedRoles.includes(decoded.role)) {
        setHasRole(true);
      }
    } catch (error) {
      console.error('Error decoding JWT in RoleCheck:', error);
    }
  }, [allowedRoles]);

  return hasRole ? <>{children}</> : null;
}
