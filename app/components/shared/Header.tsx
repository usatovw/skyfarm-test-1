'use client'

import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function Header({ breadcrumbs, className }: HeaderProps) {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { title: '🏠 Главная', href: '/' },
    { title: 'Зоны выращивания', href: '/farm' },
    { title: 'Контейнер № 41-i2f' }
  ];

  const displayBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  return (
    <div className={cn("bg-card border-b border-border", className)}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {displayBreadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.title}
                </a>
              ) : (
                <span className="text-foreground">{crumb.title}</span>
              )}
              {index < displayBreadcrumbs.length - 1 && (
                <span>/</span>
              )}
            </div>
          ))}
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-card border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className="px-3 py-1 border-r bg-card hover:bg-accent rounded-none"
            >
              🇷🇺
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="px-3 py-1 bg-secondary rounded-none"
            >
              🇺🇸
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}