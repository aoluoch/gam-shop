import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, AdminLayout } from '@/components/layout';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { ROUTES } from '@/constants/routes';
import { 
  PrivacyPolicyPage, 
  TermsPage, 
  LoginPage, 
  RegisterPage, 
  ForgotPasswordPage, 
  ResetPasswordPage,
  CartPage,
  AccountPage,
  OrdersPage,
  CheckoutPage,
  OrderSuccessPage,
  AdminDashboardPage,
  AdminProductsPage,
  AdminProductFormPage,
  AdminOrdersPage,
  AdminOrderDetailPage,
  AdminCustomersPage,
  AdminSettingsPage,
  AdminCategoriesPage,
  AdminContactMessagesPage,
} from '@/pages';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { ProductCard } from '@/components/product';
import { SAMPLE_PRODUCTS } from '@/constants/products';
import { HeroSection, FeaturedProducts, CategorySection, TestimonialsSection } from '@/components/home';
import { ContactForm } from '@/components/contact';

// Placeholder pages - will be replaced with actual page components
function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
      <TestimonialsSection />
    </div>
  );
}

function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Shop All Products</h1>
      <p className="text-muted-foreground mb-8">Browse our collection of books, apparel, and accessories.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SAMPLE_PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function BooksPage() {
  const books = SAMPLE_PRODUCTS.filter(p => p.category === 'books');
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Books</h1>
      <p className="text-muted-foreground mb-8">Spiritual books by Apostle David Owusu and Rev. Eunice.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ApparelPage() {
  const apparel = SAMPLE_PRODUCTS.filter(p => p.category === 'apparel');
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Apparel</h1>
      <p className="text-muted-foreground mb-8">T-shirts in various sizes and colors.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {apparel.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function AccessoriesPage() {
  const accessories = SAMPLE_PRODUCTS.filter(p => p.category === 'accessories');
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Accessories</h1>
      <p className="text-muted-foreground mb-8">Caps and rubber bands.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {accessories.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">About Us</h1>
      <p className="text-muted-foreground">Learn more about our ministry and mission.</p>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions about our products or ministry? We'd love to hear from you. 
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}

// Admin route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  if (authLoading || adminLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to={ROUTES.ACCOUNT} replace />;
  }
  
  return <>{children}</>;
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return <>{children}</>;
}

// Guest route wrapper (redirect if already logged in)
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to={ROUTES.ACCOUNT} replace />;
  }
  
  return <>{children}</>;
}


function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Wishlist</h1>
      <p className="text-muted-foreground">Your saved items.</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Main site routes */}
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SHOP} element={<ShopPage />} />
        <Route path={ROUTES.BOOKS} element={<BooksPage />} />
        <Route path={ROUTES.APPAREL} element={<ApparelPage />} />
        <Route path={ROUTES.ACCESSORIES} element={<AccessoriesPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />
        <Route path={ROUTES.CHECKOUT} element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
        
        {/* Guest-only routes (redirect if logged in) */}
        <Route path={ROUTES.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path={ROUTES.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        
        {/* Protected routes (require login) */}
        <Route path={ROUTES.ACCOUNT} element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path={ROUTES.ORDERS} element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path={ROUTES.WISHLIST} element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
      </Route>

      {/* Admin routes with AdminLayout (sidebar navigation) */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
        <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProductsPage />} />
        <Route path={`${ROUTES.ADMIN_PRODUCTS}/new`} element={<AdminProductFormPage />} />
        <Route path={`${ROUTES.ADMIN_PRODUCTS}/:id/edit`} element={<AdminProductFormPage />} />
        <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrdersPage />} />
        <Route path={`${ROUTES.ADMIN_ORDERS}/:id`} element={<AdminOrderDetailPage />} />
        <Route path={ROUTES.ADMIN_CUSTOMERS} element={<AdminCustomersPage />} />
        <Route path={ROUTES.ADMIN_CATEGORIES} element={<AdminCategoriesPage />} />
        <Route path={ROUTES.ADMIN_MESSAGES} element={<AdminContactMessagesPage />} />
        <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
