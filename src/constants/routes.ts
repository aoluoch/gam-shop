export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  BOOKS: '/shop/books',
  APPAREL: '/shop/apparel',
  ACCESSORIES: '/shop/accessories',
  PRODUCT: '/product/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  LOGIN: '/login',
  REGISTER: '/register',
  ORDERS: '/orders',
  ORDER_TRACK: '/orders/track',
  WISHLIST: '/wishlist',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  FAQ: '/faq',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
  // Admin routes
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Shop', href: ROUTES.SHOP },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Contact', href: ROUTES.CONTACT },
] as const;

export const SHOP_CATEGORIES = [
  { label: 'All Products', href: ROUTES.SHOP },
  { label: 'Books', href: ROUTES.BOOKS },
  { label: 'Apparel', href: ROUTES.APPAREL },
  { label: 'Accessories', href: ROUTES.ACCESSORIES },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: ROUTES.ADMIN },
  { label: 'Products', href: ROUTES.ADMIN_PRODUCTS },
  { label: 'Orders', href: ROUTES.ADMIN_ORDERS },
  { label: 'Customers', href: ROUTES.ADMIN_CUSTOMERS },
  { label: 'Categories', href: ROUTES.ADMIN_CATEGORIES },
  { label: 'Settings', href: ROUTES.ADMIN_SETTINGS },
] as const;
