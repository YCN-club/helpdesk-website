'use client';

import { Info, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import { createSeverity, getSeverity } from '@/lib/actions/severity';

import { Badge } from '@/components/ui/badge';
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

interface Severity {
  id: string;
  name: string;
  level: number;
  note?: string;
}

export default function SettingsSeverityPage() {
  const [severities, setSeverities] = useState<Severity[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSeverity, setNewSeverity] = useState({
    name: '',
    level: 1,
    note: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSeverity();
        setSeverities(data.severity || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch severity');
      }
      setIsLoading(false);
    })();
  }, []);

  async function handleAddSeverity() {
    setIsCreating(true);
    const createPromise = createSeverity(newSeverity);
    toast.promise(createPromise, {
      loading: 'Creating severity...',
      success: 'Severity created successfully',
      error: (error: any) => error.message || 'Failed to create severity',
    });

    try {
      await createPromise;
      setNewSeverity({ name: '', level: 1, note: '' });
      setIsDialogOpen(false);
      const updated = await getSeverity();
      setSeverities(updated.severity || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }

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
                <Label htmlFor="level" className="text-right">
                  Level
                </Label>
                <Input
                  id="level"
                  type="number"
                  value={newSeverity.level}
                  onChange={(e) =>
                    setNewSeverity({
                      ...newSeverity,
                      level: parseInt(e.target.value, 10),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="note" className="text-right">
                  Note
                </Label>
                <Input
                  id="note"
                  value={newSeverity.note}
                  onChange={(e) =>
                    setNewSeverity({ ...newSeverity, note: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddSeverity} disabled={isCreating}>
              Add Severity
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between rounded border p-4"
            >
              <div>
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="mt-2 h-4 w-1/5" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {severities?.map((severity) => (
            <div
              key={severity.id}
              className="flex justify-between rounded border p-4"
            >
              <div>
                <h2 className="flex items-center space-x-2 font-semibold">
                  <span>{severity.name}</span>
                  <Badge variant="secondary">Level {severity.level}</Badge>
                </h2>
                {severity.note && (
                  <p className="mt-1 flex items-center space-x-1 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>{severity.note}</span>
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit severity</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete severity</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
