import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ROUTES, ADMIN_NAV_LINKS } from '@/constants/routes';
import { cn } from '@/lib/utils';
import gamLogo from '@/assets/gamlogo.png';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Dashboard': LayoutDashboard,
  'Products': Package,
  'Orders': ShoppingCart,
  'Customers': Users,
  'Categories': FolderTree,
  'Settings': Settings,
};

export function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === ROUTES.ADMIN) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link to={ROUTES.ADMIN} className="flex items-center gap-2">
            <img src={gamLogo} alt="GAM" className="h-8 w-auto" />
            <span className="font-bold text-lg">Admin</span>
          </Link>
        )}
        {collapsed && (
          <Link to={ROUTES.ADMIN} className="mx-auto">
            <img src={gamLogo} alt="GAM" className="h-8 w-auto" />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = iconMap[link.label] || LayoutDashboard;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive(link.href) && "bg-sidebar-primary text-sidebar-primary-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <Link
          to={ROUTES.HOME}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Back to Store" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "mt-2 w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "px-2"
          )}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
