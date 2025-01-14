import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.12))] flex-col pt-4">
      <div className="flex w-full items-center justify-between border-b pb-8 pt-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="mt-1 flex items-center space-x-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <div className="grid flex-grow grid-cols-3 gap-4 overflow-hidden pt-8">
        <div className="col-span-2 flex flex-col overflow-hidden">
          <div className="flex-grow space-y-4 overflow-y-auto p-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex justify-end">
                <Skeleton className="h-16 w-3/4 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-2 pb-1 pl-1">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="h-full overflow-y-auto border-l pl-4">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="space-y-4">
            <div className="flex items-center space-x-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center space-x-0.5">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
