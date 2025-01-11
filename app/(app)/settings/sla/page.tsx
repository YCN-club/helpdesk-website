
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getSlas } from '@/lib/actions/sla';
import { toast } from 'sonner';

const slaSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
    responseTime: z.number().min(1, 'Response time is required').positive('Response time must be positive'),
});

type SLAFormValues = z.infer<typeof slaSchema>;

export default function SLA() {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<SLAFormValues>({
        resolver: zodResolver(slaSchema),
        defaultValues: {
            name: '',
            description: '',
            responseTime: 0,
        },
    });

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
        <div>
            <h1>SLA Page</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <Input type="number" placeholder="Enter response time in hours" {...field} />
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
        </div>
    );
}