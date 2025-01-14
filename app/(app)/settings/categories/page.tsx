'use client';

import { ChevronRight, Plus, Trash2 } from 'lucide-react';

import { useEffect, useState } from 'react';

import { getCategories, getSubcategories } from '@/lib/actions/categories';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Category {
  id: string;
  name: string;
  subcats: Array<{ id: string; category_id: string; name: string }>;
}

export default function SettingsCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const cats = await getCategories();
        const expanded = await Promise.all(
          cats.map(async (cat) => {
            const subcats = await getSubcategories(cat.id);
            return { ...cat, subcats };
          })
        );
        setCategories(expanded);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <TooltipProvider>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button variant="default" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {categories === null ? (
            <>
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="w-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, subIndex) => (
                        <div key={subIndex} className="flex items-center justify-between rounded-md border p-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            categories.map((cat) => (
              <Card key={cat.id} className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{cat.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {cat.subcats.length} subcategories
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Deleting items is yet to be implemented
                        </TooltipContent>
                      </Tooltip>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  {cat.subcats.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {cat.subcats.map((subcat) => (
                        <div
                          key={subcat.id}
                          className="flex items-center justify-between rounded-md border p-4"
                        >
                          <span className="text-sm">{subcat.name}</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
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
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

