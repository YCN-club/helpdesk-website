'use client';

import {
  Bolt,
  Check,
  ChevronRight,
  CircleDot,
  CircleX,
  Loader2,
  X,
} from 'lucide-react';

import { useState } from 'react';

import type { TicketDetails } from '@/types';

import { getCategories } from '@/lib/actions/categories';
import { getSeverity } from '@/lib/actions/severity';
import { getSlas } from '@/lib/actions/sla';
import { getStaff } from '@/lib/actions/staff';
import { updateTicketInfo } from '@/lib/actions/tickets';
import { toTitleCase } from '@/lib/utils';

import { LabelBadge } from '@/components/label-badge';
import { RoleCheck } from '@/components/role-check';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function TicketStatus({ ticket }: { ticket: TicketDetails }) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState<
    { id: string; name: string }[]
  >([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [categoryUpdating, setCategoryUpdating] = useState(false);

  const [severityOpen, setSeverityOpen] = useState(false);
  const [severityItems, setSeverityItems] = useState<
    { id: string; name: string }[]
  >([]);
  const [severityLoading, setSeverityLoading] = useState(false);
  const [severityError, setSeverityError] = useState(false);
  const [severityUpdating, setSeverityUpdating] = useState(false);

  const [slaOpen, setSlaOpen] = useState(false);
  const [slaItems, setSlaItems] = useState<{ id: string; name: string }[]>([]);
  const [slaLoading, setSlaLoading] = useState(false);
  const [slaError, setSlaError] = useState(false);
  const [slaUpdating, setSlaUpdating] = useState(false);

  const [staffOpen, setStaffOpen] = useState(false);
  const [staffItems, setStaffItems] = useState<{ id: string; name: string }[]>(
    []
  );
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState(false);
  const [staffUpdating, setStaffUpdating] = useState(false);

  async function onOpenCategory() {
    setCategoryOpen(true);
    setCategoryLoading(true);
    try {
      const data = await getCategories();
      setCategoryItems(data);
    } catch {
      setCategoryError(true);
    } finally {
      setCategoryLoading(false);
    }
  }

  async function onSelectCategory(newValue: string) {
    setCategoryUpdating(true);
    await updateTicketInfo({
      ticketId: ticket.id,
      field: 'category',
      value: newValue,
    });
    setCategoryUpdating(false);
    setCategoryOpen(false);
  }

  async function onOpenSeverity() {
    setSeverityOpen(true);
    setSeverityLoading(true);
    try {
      const data = await getSeverity();
      setSeverityItems(data);
    } catch {
      setSeverityError(true);
    } finally {
      setSeverityLoading(false);
    }
  }

  async function onSelectSeverity(newValue: string) {
    setSeverityUpdating(true);
    await updateTicketInfo({
      ticketId: ticket.id,
      field: 'severity',
      value: newValue,
    });
    setSeverityUpdating(false);
    setSeverityOpen(false);
  }

  async function onOpenSla() {
    setSlaOpen(true);
    setSlaLoading(true);
    try {
      const data = await getSlas();
      setSlaItems(data);
    } catch {
      setSlaError(true);
    } finally {
      setSlaLoading(false);
    }
  }

  async function onSelectSla(newValue: string) {
    setSlaUpdating(true);
    await updateTicketInfo({
      ticketId: ticket.id,
      field: 'sla',
      value: newValue,
    });
    setSlaUpdating(false);
    setSlaOpen(false);
  }

  async function onOpenStaff() {
    setStaffOpen(true);
    setStaffLoading(true);
    try {
      const data = await getStaff();
      setStaffItems(data);
    } catch {
      setStaffError(true);
    } finally {
      setStaffLoading(false);
    }
  }

  async function onSelectStaff(newValue: string) {
    setStaffUpdating(true);
    await updateTicketInfo({
      ticketId: ticket.id,
      field: 'assignee',
      value: newValue,
    });
    setStaffUpdating(false);
    setStaffOpen(false);
  }

  return (
    <div className="h-full overflow-y-auto border-l pl-4">
      <h2 className="pb-2 text-lg font-semibold">Ticket Details</h2>
      <div className="space-y-2 overflow-y-auto">
        <div className="flex items-center space-x-1">
          {ticket.ticket_status === 'OPEN' ? (
            <LabelBadge name="Open" color="#008240" icon={CircleDot} />
          ) : (
            <LabelBadge name="Closed" color="#9c0909" icon={CircleX} />
          )}
          {ticket.resolution_status === 'RESOLVED' ? (
            <LabelBadge name="Resolved" color="#008240" icon={Check} />
          ) : (
            <LabelBadge name="Unresolved" color="#9c0909" icon={X} />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between pr-1">
            <p className="text-sm font-semibold text-muted-foreground">
              Category
            </p>
            <RoleCheck role="team" fallback={<></>}>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="!size-8 rounded-full"
                    onClick={onOpenCategory}
                  >
                    {categoryUpdating ? (
                      <Loader2 className="!size-4 animate-spin" />
                    ) : (
                      <Bolt className="!size-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      {categoryLoading ? (
                        <CommandEmpty className="flex items-center justify-center p-4">
                          <Loader2 className="size-6 animate-spin" />
                        </CommandEmpty>
                      ) : categoryError ? (
                        <CommandEmpty>
                          Could not fetch at this time.
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {categoryItems
                            .filter(
                              (item) =>
                                item.id !== ticket.subcategory.category.id
                            )
                            .map((item) => (
                              <CommandItem
                                key={item.id}
                                onSelect={() => onSelectCategory(item.id)}
                              >
                                <LabelBadge name={item.name} color="#555" />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </RoleCheck>
          </div>
          <div className="flex items-center space-x-0.5">
            <LabelBadge
              name={toTitleCase(ticket.subcategory.category.name)}
              color="#333"
            />
            <ChevronRight className="size-4" />
            <LabelBadge
              name={toTitleCase(ticket.subcategory.name)}
              color="#333"
            />
          </div>
        </div>
        <RoleCheck role="team" fallback={<></>}>
          <div className="space-y-1">
            <div className="flex items-center justify-between pr-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Severity
              </p>
              <Popover open={severityOpen} onOpenChange={setSeverityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="!size-8 rounded-full"
                    onClick={onOpenSeverity}
                  >
                    {severityUpdating ? (
                      <Loader2 className="!size-4 animate-spin" />
                    ) : (
                      <Bolt className="!size-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search severity..." />
                    <CommandList>
                      {severityLoading ? (
                        <CommandEmpty className="flex items-center justify-center p-4">
                          <Loader2 className="size-6 animate-spin" />
                        </CommandEmpty>
                      ) : severityError ? (
                        <CommandEmpty>
                          Could not fetch at this time.
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {severityItems
                            .filter((item) => item.id !== ticket.severity.id)
                            .map((item) => (
                              <CommandItem
                                key={item.id}
                                onSelect={() => onSelectSeverity(item.id)}
                              >
                                <LabelBadge
                                  name={toTitleCase(item.name)}
                                  color="#555"
                                />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <LabelBadge
              name={`${ticket.severity.name} (Level ${ticket.severity.level})`}
              color="#333"
            />
          </div>
        </RoleCheck>
        <RoleCheck role="team" fallback={<></>}>
          <div className="space-y-1">
            <div className="flex items-center justify-between pr-1">
              <p className="text-sm font-semibold text-muted-foreground">SLA</p>
              <Popover open={slaOpen} onOpenChange={setSlaOpen}>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="!size-8 rounded-full"
                    onClick={onOpenSla}
                  >
                    {slaUpdating ? (
                      <Loader2 className="!size-4 animate-spin" />
                    ) : (
                      <Bolt className="!size-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search SLA..." />
                    <CommandList>
                      {slaLoading ? (
                        <CommandEmpty className="flex items-center justify-center p-4">
                          <Loader2 className="size-6 animate-spin" />
                        </CommandEmpty>
                      ) : slaError ? (
                        <CommandEmpty>
                          Could not fetch at this time.
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {slaItems
                            .filter((item) => item.id !== ticket.sla.id)
                            .map((item) => (
                              <CommandItem
                                key={item.id}
                                onSelect={() => onSelectSla(item.id)}
                              >
                                <LabelBadge
                                  name={toTitleCase(item.name)}
                                  color="#555"
                                />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <LabelBadge name={ticket.sla.name} color="#333" />
          </div>
        </RoleCheck>
        <div className="space-y-1">
          <div className="flex items-center justify-between pr-1">
            <p className="text-sm font-semibold text-muted-foreground">
              Assignee
            </p>
            <RoleCheck role="team" fallback={<></>}>
              <Popover open={staffOpen} onOpenChange={setStaffOpen}>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="!size-8 rounded-full"
                    onClick={onOpenStaff}
                  >
                    {staffUpdating ? (
                      <Loader2 className="!size-4 animate-spin" />
                    ) : (
                      <Bolt className="!size-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search staff..." />
                    <CommandList>
                      {staffLoading ? (
                        <CommandEmpty className="flex items-center justify-center p-4">
                          <Loader2 className="size-6 animate-spin" />
                        </CommandEmpty>
                      ) : staffError ? (
                        <CommandEmpty>
                          Could not fetch at this time.
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {staffItems
                            .filter((item) => item.id !== ticket.assignee.id)
                            .map((item) => (
                              <CommandItem
                                key={item.id}
                                onSelect={() => onSelectStaff(item.id)}
                              >
                                {item.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </RoleCheck>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${ticket.assignee.name}`}
              />
              <AvatarFallback>
                {ticket.assignee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span>{ticket.assignee.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
