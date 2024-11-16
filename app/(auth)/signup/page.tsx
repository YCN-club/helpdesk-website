'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { decodeJwt } from 'jose';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { registerUser } from '@/lib/actions/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  yearOfGraduation: z
    .number()
    .int()
    .min(currentYear - 5, `Year cannot be lower than ${currentYear - 5}`)
    .max(currentYear + 5, `Year cannot be higher than ${currentYear + 5}`),
  degree: z.string().min(1, 'Degree is required'),
  hostelBlock: z.string().min(1, 'Hostel block is required'),
  roomNumber: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      yearOfGraduation: currentYear,
      degree: '',
      hostelBlock: '',
      roomNumber: '',
    },
  });

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)JWT_TOKEN\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    if (token) {
      try {
        const decodedToken = decodeJwt(token) as {
          email?: string;
          name?: string;
          roles?: string[];
        };
        if (!decodedToken.roles?.includes('signup')) {
          router.push('/dashboard');
          return;
        }
        if (decodedToken.email) {
          form.setValue('email', decodedToken.email);
        }
        if (decodedToken.name) {
          form.setValue('name', decodedToken.name);
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [form, router]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const result = await registerUser(formData);

    if (result.success) {
      toast.success('Registration successful!');
      router.push('/dashboard');
    } else if (result.error) {
      if (result.error.includes('temporarily unavailable')) {
        toast.error(result.error, {
          description:
            'Our systems are experiencing high traffic. Please try again in a few minutes.',
          duration: 5000,
        });
      } else {
        toast.error(result.error);
      }
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Please provide your details to complete the signup process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="yearOfGraduation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Graduation</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BBA (Hons.)">BBA (Hons.)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hostelBlock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hostel Block</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== 'Day Scholar') {
                          form.setValue('roomNumber', '');
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hostel block" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HB-1">HB-1</SelectItem>
                        <SelectItem value="HB-2">HB-2</SelectItem>
                        <SelectItem value="HB-3">HB-3</SelectItem>
                        <SelectItem value="HB-4">HB-4</SelectItem>
                        <SelectItem value="HB-5">HB-5</SelectItem>
                        <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.watch('hostelBlock') === 'Day Scholar'}
                        value={
                          form.watch('hostelBlock') === 'Day Scholar'
                            ? 'N/A'
                            : field.value
                        }
                        onChange={(e) => {
                          if (form.watch('hostelBlock') !== 'Day Scholar') {
                            field.onChange(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Complete'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
