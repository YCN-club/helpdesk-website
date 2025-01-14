'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { runtimeEnv } from '@/config/env';

import { getCategories, getSubcategories } from '@/lib/actions/categories';
import { createTicket } from '@/lib/actions/tickets';

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

const ticketSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(1000, 'Content must be less than 1000 characters'),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function CreateTicketPageClient() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      category: '',
      subcategory: '',
      content: '',
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleCategoryChange(value: string) {
    form.setValue('category', value);
    setCategory(value);
    form.setValue('subcategory', '');
    setIsLoading(true);
    try {
      const data = await getSubcategories(value);
      setSubcategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: TicketFormValues) {
    setIsLoading(true);
    try {
      await createTicket({
        title: data.title,
        subcategory_id: data.subcategory,
        initial_message: data.content,
      });
      toast.success('Ticket created successfully');
      router.push('/tickets');
    } catch (error) {
      toast.error('Failed to create ticket');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto mt-4 w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Ticket</CardTitle>
        <CardDescription>
          Fill out the form below to submit a new support ticket.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a brief title for your ticket"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={handleCategoryChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!category || isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem disabled value="loading">
                            Loading subcategories...
                          </SelectItem>
                        ) : (
                          subcategories.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of your issue or request"
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
