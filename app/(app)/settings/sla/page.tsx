'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useEffect, useState } from 'react';

import type { Ticket } from '@/types/tickets';

import { getSlas } from '@/lib/actions/sla';

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

const slaSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  responseTime: z
    .number()
    .min(1, 'Response time is required')
    .positive('Response time must be positive'),
});

type SLAFormValues = z.infer<typeof slaSchema>;

export default function SLA() {
  const [isLoading, setIsLoading] = useState(false);
  const [slas, setSlas] = useState<Ticket['sla'][] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<SLAFormValues>({
    resolver: zodResolver(slaSchema),
    defaultValues: {
      name: '',
      description: '',
      responseTime: 0,
    },
  });

  useEffect(() => {
    getSlas().then((data) => setSlas(data));
  }, []);

  async function onSubmit(data: SLAFormValues) {
    setIsLoading(true);
    try {
      await getSlas();
      toast.success('SLA created successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to create SLA');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Service Level Agreement</h1>
          <Button
            variant="default"
            size="icon"
            onClick={() => setDialogOpen(true)}
          >
            <Plus />
          </Button>
        </div>
        <div className="mt-4">
          {slas === null ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="mb-2 flex justify-between rounded border p-4"
                >
                  <div>
                    <Skeleton className="mb-2 h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            slas.map((sla) => (
              <div
                key={sla.id}
                className="mb-2 flex justify-between rounded border p-4"
              >
                <div>
                  <h2 className="font-semibold">{sla.name}</h2>
                  <p className="text-sm text-muted-foreground">{sla.note}</p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Deleting items is yet to be implemented
                  </TooltipContent>
                </Tooltip>
              </div>
            ))
          )}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create SLA</DialogTitle>
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
                        <Input placeholder="Enter SLA name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SLA description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responseTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Time (hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter response time in hours"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create SLA'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
