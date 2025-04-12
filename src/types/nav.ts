/**
 * Navigation item type definitions
 * @description Defines the structure for navigation items throughout the application
 */

export interface NavItem {
  slug: string;
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
  icon?: string;
  children?: NavItemChild[];
}

export interface NavItemChild {
  title: string;
  href: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  external?: boolean;
  slug?: string; // Added slug as optional property
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
