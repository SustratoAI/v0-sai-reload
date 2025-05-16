"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Text } from "@/components/ui/text";

interface SidebarNavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname() || "";
  
  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (pathname && pathname.startsWith(`${item.href}/`));
        
        if (item.disabled) {
          return (
            <div
              key={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md opacity-70 cursor-not-allowed"
            >
              {Icon && <Icon className="w-5 h-5 mr-2" />}
              <Text variant="muted">{item.title}</Text>
            </div>
          );
        }
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/15"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "w-5 h-5 mr-2",
                  isActive ? "text-primary" : "text-foreground/70"
                )}
              />
            )}
            <Text 
              variant={isActive ? "subtitle" : "default"} 
              className={cn(
                isActive ? "font-medium" : "font-normal"
              )}
            >
              {item.title}
            </Text>
          </Link>
        );
      })}
    </nav>
  );
}
