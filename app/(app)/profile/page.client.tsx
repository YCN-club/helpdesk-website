'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserData {
  name: string;
  email: string;
  data: {
    [key: string]: {
      name: string;
      value: string;
    };
  };
}

export default function ProfilePageClient({
  userData,
}: {
  userData: UserData;
}) {
  const handleSave = () => {
    toast.error('Data is not currently editable');
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identification Details</CardTitle>
            <CardDescription>
              Your personal identification information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={userData.name} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={userData.email} disabled />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Details</CardTitle>
            <CardDescription>
              Additional information about your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(userData.data).map(([key, { name, value }]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{name}</Label>
                  <Input id={key} value={value} disabled />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
