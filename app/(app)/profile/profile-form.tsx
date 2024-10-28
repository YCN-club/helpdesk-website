'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { CalendarDots } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as y from 'yup';

import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const profileFormSchema = y.object().shape({
  rank: y.string().required('This field is required'),
  firstName: y.string().required('This field is required'),
  lastName: y.string().required('This field is required'),
  dateOfBirth: y.date().required('This field is required'),
  gender: y
    .string()
    .required('This field is required')
    .oneOf(['male', 'female', 'other']),
});

export function ProfileForm({ name }: { name: string | undefined }) {
  const names = name?.split(' ') || [];
  const [rank, firstName, lastName] =
    names.length >= 2
      ? names.length === 3
        ? names
        : ['-', ...names]
      : ['', '', ''];

  const form = useForm<y.InferType<typeof profileFormSchema>>({
    resolver: yupResolver(profileFormSchema),
    defaultValues: {
      rank: '-',
      firstName: '-',
      lastName: '-',
      dateOfBirth: new Date('1999-11-11'),
      gender: 'male',
    },
  });

  useEffect(() => {
    form.reset({ rank, firstName, lastName });
  }, [form, rank, firstName, lastName]);

  function onSubmit(values: y.InferType<typeof profileFormSchema>) {
    toast.success('Your changes have been saved.');
  }

  return (
    <Form {...form}>
      <form
        id="profile"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-6 gap-2"
      >
        <FormField
          control={form.control}
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <Input disabled className="col-span-1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input disabled className="col-span-1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input disabled className="col-span-1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-1" />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'col-span-1 pl-3 text-left',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'dd/mm/yy')
                      ) : (
                        <span>Select</span>
                      )}
                      <CalendarDots className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) =>
                      date > new Date() || date < new Date('1940-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
