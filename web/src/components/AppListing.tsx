'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { App } from '@/lib/types';
import { AppCard } from './AppCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Palette, Rocket, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
// import { ThemeToggle } from '@/components/theme-toggle';

interface AppListingProps {
  initialApps: App[];
}

const ITEMS_PER_PAGE = 6;

export function AppListing({ initialApps }: AppListingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialApps.forEach(app => app.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [initialApps]);

  const filteredApps = useMemo(() => {
    let apps = initialApps;

    if (selectedTag) {
      apps = apps.filter(app => app.tags.includes(selectedTag));
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      apps = apps.filter(app =>
        app.title.toLowerCase().includes(lowerCaseQuery) ||
        app.description.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return apps;
  }, [initialApps, searchQuery, selectedTag]);

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  
  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredApps.slice(startIndex, endIndex);
  }, [filteredApps, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Show first page, last page, and pages around current page
    const pagesToShow = new Set<number>();

    pagesToShow.add(1); // Always show first page
    pagesToShow.add(totalPages); // Always show last page

    // Add pages around current page
    for (let i = -1; i <= 1; i++) {
        const page = currentPage + i;
        if (page > 1 && page < totalPages) {
            pagesToShow.add(page);
        }
    }

    const sortedPages = Array.from(pagesToShow).sort((a,b) => a - b);
    
    let lastPage: number | null = null;
    for (const page of sortedPages) {
        if (lastPage !== null && page - lastPage > 1) {
            pageNumbers.push(<span key={`ellipsis-${lastPage}`} className="px-2 py-1 text-muted-foreground">...</span>);
        }
        pageNumbers.push(
            <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="h-8 w-8 p-0"
            >
                {page}
            </Button>
        );
        lastPage = page;
    }

    return pageNumbers;
};


  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-xl bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between border">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-primary" />
          </Link>
          <div className='flex-grow'>
             <h1 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl font-headline">
              Streamlit App Hub
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              A curated collection of innovative applications.
            </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-6 text-base"
            />
          </div>
          {/* <ThemeToggle /> */}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filter by tag:</span>
        <Button
          variant={selectedTag === null ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setSelectedTag(null)}
          className={cn("rounded-full", selectedTag === null && "dark:text-white")}
        >
          All
        </Button>
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={selectedTag === tag ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedTag(tag)}
            className={cn("rounded-full", selectedTag === tag && "dark:text-white")}
          >
            {tag}
          </Button>
        ))}
      </div>

      {paginatedApps.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedApps.map(app => (
              <AppCard key={app.name} app={app} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {renderPageNumbers()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-24 text-center">
            <Palette className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-foreground">No applications found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filter.
            </p>
            <Button variant="outline" size="sm" className="mt-6" onClick={() => { setSearchQuery(''); setSelectedTag(null); }}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
        </div>
      )}
    </div>
  );
}
