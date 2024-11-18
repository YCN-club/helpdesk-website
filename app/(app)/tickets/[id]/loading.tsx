import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TicketDetailsPageSkeleton() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.12))] flex-col pt-4">
      <div className="grid flex-grow grid-cols-3 gap-4 overflow-hidden">
        <div className="col-span-2 flex flex-col overflow-hidden">
          <Card className="flex h-full flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex flex-col">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto">
                <div className="space-y-4 p-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex justify-start">
                      <div className="w-3/4 max-w-[75%] space-y-2 rounded-lg bg-secondary p-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Skeleton className="h-10 flex-grow" />
                <Skeleton className="h-10 w-10" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="overflow-y-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Status',
                'Resolution',
                'Subcategory',
                'Severity',
                'SLA',
                'Created',
                'Assignee',
              ].map((item, index) => (
                <div key={index}>
                  <Skeleton className="mb-1 h-4 w-1/3" />
                  {item === 'Assignee' ? (
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                    <Skeleton className="h-6 w-1/2" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
