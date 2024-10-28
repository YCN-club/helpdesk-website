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

const identificationFormSchema = y.object().shape({
  icNo: y.string().required('This field is required'),
  aadharNo: y.string().required('This field is required'),
  panNo: y.string().required('This field is required'),
});

export function IdentificationForm() {
  const form = useForm<y.InferType<typeof identificationFormSchema>>({
    resolver: yupResolver(identificationFormSchema),
    defaultValues: {
      icNo: '17115',
      aadharNo: '123456789102',
      panNo: 'CKRUP1932L',
    },
  });

  function onSubmit(values: y.InferType<typeof identificationFormSchema>) {
    toast.success('Your changes have been saved.');
  }

  return (
    <Form {...form}>
      <form
        id="identification"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-6 gap-2"
      >
        <FormField
          control={form.control}
          name="icNo"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Registration ID</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aadharNo"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Aadhar Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="panNo"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>PAN Card Number</FormLabel>
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
