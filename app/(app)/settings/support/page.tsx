'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useEffect, useState } from 'react';

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
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z
    .string()
    .min(1, 'Role is required')
    .max(255, 'Role must be less than 255 characters'),
});

type SupportStaffFormValues = z.infer<typeof supportStaffSchema>;

export default function SupportPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<SupportStaffFormValues>({
    resolver: zodResolver(supportStaffSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
    },
  });

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setSupportStaff([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Support Agent',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Support Manager',
        },
      ]);
      setIsLoading(false);
    }, 1000);
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
    try {
      // Implement the API call to add support staff here
      console.log('Support staff data:', data);
      toast.success('Support staff added successfully');
      form.reset();
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add support staff');
      console.error(error);
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
              <div key={index} className="flex items-center justify-between rounded border p-4">
                <div className="space-y-2 flex-1">
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter staff name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Input placeholder="Enter staff role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Support Staff</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

