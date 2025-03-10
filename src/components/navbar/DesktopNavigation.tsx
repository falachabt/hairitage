
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationItem {
  name: string;
  path: string;
}

interface DesktopNavigationProps {
  mainNavItems: NavigationItem[];
  categories: NavigationItem[];
}

const DesktopNavigation = ({ mainNavItems, categories }: DesktopNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center gap-6 mx-6">
      {mainNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground",
            location.pathname === item.path 
              ? "text-foreground" 
              : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1 h-auto py-1.5">
            <span className="text-sm font-medium">Catégories</span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48 bg-background border shadow-md">
          {categories.map((category) => (
            <DropdownMenuItem key={category.path} asChild>
              <Link to={category.path}>{category.name}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default DesktopNavigation;
