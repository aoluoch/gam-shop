import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, ChevronDown, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ROUTES, NAV_LINKS, SHOP_CATEGORIES } from '@/constants/routes';
import { cn } from '@/lib/utils';

import gamLogo from '@/assets/gamlogo.png';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.HOME);
  };

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const cartItemCount = 0; // TODO: Get from cart context

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <img 
              src={gamLogo} 
              alt="GAM Shop" 
              className="h-10 w-auto"
            />
            <span className="hidden font-bold text-xl text-primary sm:inline-block">
              GAM Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              link.label === 'Shop' ? (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'flex items-center gap-1',
                        isActive(link.href) && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {link.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {SHOP_CATEGORIES.map((category) => (
                      <DropdownMenuItem key={category.href} asChild>
                        <Link 
                          to={category.href}
                          className="w-full cursor-pointer"
                        >
                          {category.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={link.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    isActive(link.href) && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Link to={link.href}>{link.label}</Link>
                </Button>
              )
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:block relative">
              {searchOpen ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="h-9 w-64 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Cart */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to={ROUTES.CART} aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium truncate">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={ROUTES.ACCOUNT} className="w-full cursor-pointer">
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={ROUTES.ORDERS} className="w-full cursor-pointer">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={ROUTES.WISHLIST} className="w-full cursor-pointer">
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="w-full cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={ROUTES.LOGIN} className="w-full cursor-pointer">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={ROUTES.REGISTER} className="w-full cursor-pointer">
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col gap-6 pt-6">
                  {/* Mobile Logo */}
                  <Link 
                    to={ROUTES.HOME} 
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <img 
                      src={gamLogo} 
                      alt="GAM Shop" 
                      className="h-10 w-auto"
                    />
                    <span className="font-bold text-xl text-primary">
                      GAM Shop
                    </span>
                  </Link>

                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="h-10 w-full rounded-md border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  {/* Mobile Nav Links */}
                  <nav className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      link.label === 'Shop' ? (
                        <div key={link.href} className="flex flex-col">
                          <Link
                            to={link.href}
                            className={cn(
                              'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
                              isActive(link.href) && 'bg-accent text-accent-foreground'
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                          <div className="ml-4 flex flex-col border-l pl-4">
                            {SHOP_CATEGORIES.map((category) => (
                              <Link
                                key={category.href}
                                to={category.href}
                                className={cn(
                                  'rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                                  isActive(category.href) && 'bg-accent/50 text-accent-foreground'
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {category.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={cn(
                            'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
                            isActive(link.href) && 'bg-accent text-accent-foreground'
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      )
                    ))}
                  </nav>

                  {/* Mobile Auth Links */}
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <div className="px-3 py-2 text-sm font-medium truncate">
                          {user.user_metadata?.full_name || user.email}
                        </div>
                        <Link
                          to={ROUTES.ACCOUNT}
                          className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          to={ROUTES.ORDERS}
                          className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          to={ROUTES.WISHLIST}
                          className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full mt-2"
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button asChild className="w-full">
                          <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                            Login
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                            Register
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
