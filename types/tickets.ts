export interface Ticket {
  id: string;
  title: string;
  user: {
    id: string;
    name: string;
    email: string;
    is_team: boolean | number;
    is_sys_admin: boolean | number;
  };
  subcategory: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  assignee: {
    id: string;
    name: string;
    email: string;
    is_team: boolean | number;
    is_sys_admin: boolean | number;
  };
  severity: {
    id: string;
    name: string;
    level: number;
    note: string;
  };
  sla: {
    id: string;
    name: string;
    note: string;
  };
  created_at: string;
  closed_at: string | null;
  resolution_status: string;
  ticket_status: string;
}

export interface TicketDetails {
  id: string;
  title: string;
  user: {
    id: string;
    name: string;
    email: string;
    data: Record<string, { name: string; value: string }>;
    is_team: number;
    is_sys_admin: number;
  };
  subcategory: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  assignee: {
    id: string;
    name: string;
    email: string;
    data: Record<string, { name: string; value: string }>;
    is_team: number;
    is_sys_admin: number;
  };
  severity: {
    id: string;
    name: string;
    level: number;
    note: string;
  };
  sla: {
    id: string;
    name: string;
    note: string;
  };
  created_at: string;
  closed_at: string | null;
  resolution_status: string;
  ticket_status: string;
}

export interface Message {
  id: string;
  type: 'SYSTEM' | 'USER';
  author: {
    id: string;
    name: string;
  };
  created_at: string;
  content: string;
  file_id: string | null;
}
