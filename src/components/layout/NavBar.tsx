'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  ChevronDown,
  Brain,
  Database,
  Wrench, // Replacing Tool with Wrench
  Workflow,
  Building,
  Headset,
  BarChart,
  Rocket,
  Code,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { IconWrapper } from "@/components/common/IconWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { type NavItem } from "@/types/nav";

/**
 * Maps icon strings from config to their corresponding Lucide icon components
 */
const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  database: Database,
  wrench: Wrench, // Replacing Tool with Wrench
  workflow: Workflow,
  building: Building,
  headset: Headset,
  barChart: BarChart,
  rocket: Rocket,
  code: Code,
  bookOpen: BookOpen,
};

/**
 * Component for rendering a list item in dropdown navigation
 * @param title - The title of the navigation item
 * @param href - The link destination
 * @param description - Optional description text
 * @param icon - Optional icon identifier
 * @returns A styled navigation list item component
 */
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    href: string;
    description?: string;
    icon?: string;
  }
>(({ className, title, href, description, icon, ...props }, ref) => {
  const IconComponent = icon ? iconMap[icon] || null : null;

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href}
          className={cn(
            "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300",
            "hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className="rounded-md bg-muted p-2 group-hover:bg-primary/10 transition-colors duration-300">
                <IconComponent className="h-5 w-5" />
              </div>
            )}
            <div className="text-sm font-medium leading-none group-hover:translate-x-0.5 transition-transform duration-300">
              {title}
            </div>
          </div>
          {description && (
            <p className="line-clamp-2 mt-2 text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

/**
 * Main navigation component rendering nav items and dropdowns
 */
function MainNav() {
  const pathname = usePathname();
  const { mainNav } = siteConfig;

  // Check if a path is active (exact match or starts with path for sections)
  const isActive = (path: string): boolean => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link
        href="/"
        className="ml-4 flex items-center space-x-2 transition-opacity duration-300 hover:opacity-80"
        aria-label="Home"
      >
        <span className="sr-only md:not-sr-only font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{siteConfig.name}</span>
        <span className="md:hidden font-bold text-xl">dm</span>
      </Link>

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "group transition-all duration-300 px-3",
                  isActive("/") ? "bg-accent text-accent-foreground" : "hover:bg-accent/40"
                )}
              >
                <span className="flex items-center gap-1">
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Home</span>
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {mainNav.map((item) => {
            // If the item has children, render as dropdown
            if (item.children && item.children.length > 0) {
              return (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger
                    className={cn(
                      "group transition-all duration-300 px-3",
                      isActive(item.href) ? "bg-accent text-accent-foreground" : "hover:bg-accent/40"
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {item.title}
                      <ChevronDown className="h-3 w-3 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className={cn(
                      "grid gap-3 p-4 w-[400px] md:w-[500px]",
                      item.children.length > 2 ? "lg:grid-cols-2" : ""
                    )}>
                      {item.children.map((child) => (
                        <ListItem
                          key={child.title}
                          title={child.title}
                          href={child.href}
                          icon={child.icon}
                          description={child.description}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            // Otherwise render as regular link
            return (
              <NavigationMenuItem key={item.title}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "transition-all duration-300 px-3",
                      isActive(item.href) ? "bg-accent text-accent-foreground" : "hover:bg-accent/40"
                    )}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

/**
 * Mobile navigation item component for responsive menu
 */
function MobileNavItem({
  item,
  isActive,
  depth = 0
}: {
  item: NavItem;
  isActive: (path: string) => boolean;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={item.href}
          className={cn(
            "flex w-full items-center py-2 text-base font-medium transition-colors",
            isActive(item.href) ? "text-primary" : "text-foreground/70 hover:text-foreground",
            depth > 0 ? "pl-4" : ""
          )}
          onClick={hasChildren ? () => setIsOpen(!isOpen) : undefined}
        >
          {item.title}
        </Link>
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen ? "rotate-180" : ""
              )}
            />
            <span className="sr-only">Toggle</span>
          </Button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children?.map((child) => (
            <div key={child.href}>
              <Link
                href={child.href}
                className={cn(
                  "flex items-center gap-2 py-2 pl-4 text-sm font-medium transition-colors",
                  isActive(child.href) ? "text-primary" : "text-foreground/70 hover:text-foreground"
                )}
              >
                {child.icon && iconMap[child.icon] && (
                  <IconWrapper icon={iconMap[child.icon]} size="sm" />
                )}
                {child.title}
              </Link>
              {child.description && (
                <p className="pl-4 text-xs text-muted-foreground mb-2">{child.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Primary navigation component including desktop and mobile navigation
 */
export function NavBar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Handle scroll event to update navbar styling
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a path is active (exact match or starts with path for sections)
  const isActive = (path: string): boolean => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl transition-all duration-300",
      isScrolled ? "shadow-md" : "shadow-sm"
    )}>
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex items-center ml-auto space-x-4">
          <nav className="flex items-center space-x-2">
            <SearchInput />
            <ThemeToggle />

            {/* Mobile navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden transition-transform hover:scale-110"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] max-w-sm">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center gap-2 py-2 text-base font-medium transition-colors",
                      isActive("/") ? "text-primary" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <Home className="h-5 w-5" />
                    Home
                  </Link>

                  {/* Mobile navigation items */}
                  {siteConfig.mainNav.map((item) => (
                    <MobileNavItem
                      key={item.href}
                      item={item}
                      isActive={isActive}
                    />
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop login/signup buttons */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mr-2 transition-all duration-300 hover:border-primary/50"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-primary transition-all duration-300 hover:bg-primary/90"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
