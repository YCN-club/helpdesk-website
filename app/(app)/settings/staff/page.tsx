'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useEffect, useState } from 'react';

import { createStaff, getStaff } from '@/lib/actions/staff';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SupportStaff {
  id: string;
  name: string;
  email: string;
  role: string;
}

const supportStaffSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z.enum(['Team', 'System Admin']),
});

type SupportStaffFormValues = z.infer<typeof supportStaffSchema>;

export default function SettingsSupportPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<SupportStaffFormValues>({
    resolver: zodResolver(supportStaffSchema),
    defaultValues: {
      email: '',
      role: 'Team',
    },
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await getStaff();
        setSupportStaff(data?.staff || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch support staff');
      }
      setIsLoading(false);
    })();
  }, []);

  const handleDelete = (id: string) => {
    // Implement delete functionality here
    toast.error('Delete functionality not implemented yet');
  };

  const handleEdit = (id: string) => {
    // Implement edit functionality here
    toast.error('Edit functionality not implemented yet');
  };

  async function onSubmit(data: SupportStaffFormValues) {
    setIsCreating(true);
    const createPromise = createStaff({
      email: data.email,
      isSysAdmin: data.role === 'System Admin',
    });

    toast.promise(createPromise, {
      loading: 'Creating support staff...',
      success: 'Support staff added successfully',
      error: (error: any) => error.message || 'Failed to add support staff',
    });

    try {
      await createPromise;
      form.reset();
      setDialogOpen(false);
      // refresh staff list
      const updatedData = await getStaff();
      setSupportStaff(updatedData?.staff || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <TooltipProvider>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Support Staff</h1>
          <Button
            variant="default"
            size="icon"
            onClick={() => setDialogOpen(true)}
          >
            <Plus />
          </Button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded border p-4"
              >
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))
          ) : supportStaff.length > 0 ? (
            supportStaff.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between rounded border p-4"
              >
                <div>
                  <h2 className="font-semibold">{staff.name}</h2>
                  <p className="text-sm text-muted-foreground">{staff.email}</p>
                  <p className="text-sm">{staff.role}</p>
                </div>
                <div className="flex space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(staff.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit support staff</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(staff.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete support staff</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))
          ) : (
            <p>No support staff found.</p>
          )}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Support Staff</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter staff email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Team">Team</SelectItem>
                            <SelectItem value="System Admin">
                              System Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isCreating}>
                  Add Support Staff
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
