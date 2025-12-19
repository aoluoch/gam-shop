import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  Settings,
  LogOut,
  ChevronLeft,
  MessageSquare,
  Star,
  BarChart3,
  Boxes,
  Receipt,
  Menu
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ROUTES, ADMIN_NAV_LINKS } from '@/constants/routes';
import { cn } from '@/lib/utils';
import gamLogo from '@/assets/gamlogo.png';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Dashboard': LayoutDashboard,
  'Analytics': BarChart3,
  'Products': Package,
  'Stock': Boxes,
  'Orders': ShoppingCart,
  'Financials': Receipt,
  'Customers': Users,
  'Categories': FolderTree,
  'Reviews': Star,
  'Messages': MessageSquare,
  'Settings': Settings,
};

export function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === ROUTES.ADMIN) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-background shadow-md"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                <Link to={ROUTES.ADMIN} className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <img src={gamLogo} alt="GAM" className="h-8 w-auto" />
                  <span className="font-bold text-lg">Admin</span>
                </Link>
              </div>
              {/* Mobile Navigation */}
              <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
                {ADMIN_NAV_LINKS.map((link) => {
                  const Icon = iconMap[link.label] || LayoutDashboard;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive(link.href) && "bg-sidebar-primary text-sidebar-primary-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
              {/* Mobile Footer */}
              <div className="border-t border-sidebar-border p-2">
                <Link
                  to={ROUTES.HOME}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span>Back to Store</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col h-full border-r bg-sidebar text-sidebar-foreground transition-all duration-300 shrink-0",
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

        {/* Desktop Navigation */}
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

        {/* Desktop Footer */}
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
    </>
  );
}

export default AdminSidebar;
