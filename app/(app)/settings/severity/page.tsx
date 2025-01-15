'use client';

import { Plus, Trash2 } from 'lucide-react';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function SettingsSeverityPage() {
  const [severities, setSeverities] = useState<
    { id: number; name: string; color: string }[] | null
  >(null);
  const [newSeverity, setNewSeverity] = useState({
    name: '',
    color: '#000000',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setSeverities([
        { id: 1, name: 'Low', color: '#00FF00' },
        { id: 2, name: 'Medium', color: '#FFA500' },
        { id: 3, name: 'High', color: '#FF0000' },
      ]);
    }, 1000);
  }, []);

  const handleAddSeverity = () => {
    if (newSeverity.name) {
      setSeverities(
        (prev) => prev && [...prev, { ...newSeverity, id: Date.now() }]
      );
      setNewSeverity({ name: '', color: '#000000' });
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Severity</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Severity</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newSeverity.name}
                  onChange={(e) =>
                    setNewSeverity({ ...newSeverity, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <Input
                  id="color"
                  type="color"
                  value={newSeverity.color}
                  onChange={(e) =>
                    setNewSeverity({ ...newSeverity, color: e.target.value })
                  }
                  className="col-span-3 h-10 w-10 cursor-pointer rounded-full p-1"
                />
              </div>
            </div>
            <Button onClick={handleAddSeverity}>Add Severity</Button>
          </DialogContent>
        </Dialog>
      </div>

      {severities === null ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <div className="space-y-2">
          {severities.map((severity) => (
            <div
              key={severity.id}
              className="flex justify-between rounded border p-4"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="size-6 rounded-full border border-muted"
                  style={{ backgroundColor: severity.color }}
                />
                <span>{severity.name}</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Deleting items is yet to be implemented
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
