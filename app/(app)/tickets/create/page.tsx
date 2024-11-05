'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  user_id: z.string().min(1, { message: 'User ID is required' }),
  category_id: z.string().min(1, { message: 'Category is required' }),
  severity: z.string().min(1, { message: 'Severity is required' }),
  sla: z.string().min(1, { message: 'SLA is required' }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters long' }),
});

export default function CreateTicketForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: '',
      category_id: '',
      severity: '',
      sla: '',
      content: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Here you would typically send the form data to your backend
    console.log(values);
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
    }, 2000);
  }

  return (
    <div className="container flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
          <CardDescription>
            Fill out the form below to create a new support ticket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4"
            >
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your student ID or employee ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Academic</SelectItem>
                        <SelectItem value="2">Technical</SelectItem>
                        <SelectItem value="3">Administrative</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category that best fits your issue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the severity level of your issue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sla"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SLA</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SLA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="24h">24 hours</SelectItem>
                        <SelectItem value="48h">48 hours</SelectItem>
                        <SelectItem value="72h">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the Service Level Agreement for this ticket.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Ticket Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your issue here. Markdown is supported."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about your issue. You can use Markdown for
                      formatting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? 'Submitting...' : 'Create Ticket'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
