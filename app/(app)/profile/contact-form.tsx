'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as y from 'yup';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const contactFormSchema = y.object().shape({
  phoneNumber: y.string().required('This field is required'),
  email: y.string().email().required('This field is required'),
});

export function ContactForm() {
  const form = useForm<y.InferType<typeof contactFormSchema>>({
    resolver: yupResolver(contactFormSchema),
    defaultValues: {
      phoneNumber: '9370352302',
      email: 'testemail@gmail.com',
    },
  });

  function onSubmit(values: y.InferType<typeof contactFormSchema>) {
    toast.success('Your changes have been saved.');
  }

  return (
    <Form {...form}>
      <form
        id="contact"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-6 gap-2"
      >
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
