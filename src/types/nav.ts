/**
 * Navigation item type definitions
 * @description Defines the structure for navigation items throughout the application
 */

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
