import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ROUTES } from '@/constants/routes';
import { 
  PrivacyPolicyPage, 
  TermsPage, 
  LoginPage, 
  RegisterPage, 
  ForgotPasswordPage, 
  ResetPasswordPage 
} from '@/pages';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { useAuth } from '@/hooks/useAuth';

// Placeholder pages - will be replaced with actual page components
function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to GAM Shop</h1>
      <p className="text-muted-foreground">Your spiritual resources, apparel, and accessories destination.</p>
    </div>
  );
}

function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Shop All Products</h1>
      <p className="text-muted-foreground">Browse our collection of books, apparel, and accessories.</p>
    </div>
  );
}

function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Books</h1>
      <p className="text-muted-foreground">Spiritual books by Apostle David Owusu and Rev. Eunice.</p>
    </div>
  );
}

function ApparelPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Apparel</h1>
      <p className="text-muted-foreground">T-shirts in various sizes and colors.</p>
    </div>
  );
}

function AccessoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Accessories</h1>
      <p className="text-muted-foreground">Caps and rubber bands.</p>
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
      <h1 className="text-3xl font-bold text-primary mb-4">Contact Us</h1>
      <p className="text-muted-foreground">Get in touch with us.</p>
    </div>
  );
}

function CartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">Shopping Cart</h1>
      <p className="text-muted-foreground">Your cart is empty.</p>
    </div>
  );
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

function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">My Account</h1>
      <p className="text-muted-foreground">Manage your account settings.</p>
    </div>
  );
}

function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-4">My Orders</h1>
      <p className="text-muted-foreground">View your order history.</p>
    </div>
  );
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
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
