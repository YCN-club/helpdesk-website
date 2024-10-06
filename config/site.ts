import type { NavItem } from '@/types';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'TAPMI HelpDesk',
  description: 'A helpdesk for students.',
  institute: 'T. A. Pai Institute of Management, Bengaluru',

  navLinks: [
    {
      title: 'One',
      href: '/one',
      requiredRoles: ['ADMIN'],
    },
    {
      title: 'Two',
      href: '/two',
      requiredRoles: ['ADMIN'],
    },
    {
      title: 'Three',
      href: '/three',
      requiredRoles: ['ADMIN'],
    },
  ] satisfies NavItem[],
};
