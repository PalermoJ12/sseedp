import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem,  type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Folder, LayoutGrid, ListChecks, School, Database } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  // {
  //   title: 'Dashboard',
  //   href: '/dashboard',
  //   icon: LayoutGrid,
  // },
  {
    title: 'Items',
    href: '/items',
    icon: ListChecks,
  },
  {
    title: 'Schools',
    href: '/schools',
    icon: School,
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Folder,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: Database,
  },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
  const { auth } = usePage<SharedData>().props;

  const getNavItems = (role: number | string): NavItem[] => {
    if (role === 0 || role === "0") {
      return mainNavItems.filter(item => item.title === 'Inventory');
    }
    return mainNavItems;
  };

  const navItems = getNavItems(auth.user.role);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} /> {/* ✅ use filtered items */}
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
