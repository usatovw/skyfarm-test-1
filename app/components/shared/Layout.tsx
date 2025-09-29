'use client'

import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BreadcrumbItem } from "@/types";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function Layout({ children, breadcrumbs, className }: LayoutProps) {
  return (
    <div className={cn("h-screen flex flex-col bg-background", className)}>
      <Header breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}