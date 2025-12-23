# GAM Shop - E-Commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, and Supabase. GAM Shop is designed for selling books, apparel, and accessories with a comprehensive admin dashboard for managing products, orders, customers, and store settings.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Admin Features](#admin-features)
- [Payment Integration](#payment-integration)
- [API Services](#api-services)
- [Contributing](#contributing)

## ✨ Features

### Customer Features
- **Product Catalog**: Browse products by category (Books, Apparel, Accessories)
- **Product Details**: View detailed product information with images, variants, and reviews
- **Shopping Cart**: Persistent cart for logged-in users with size/color variant support
- **Wishlist**: Save products for later
- **User Authentication**: Secure registration, login, password reset
- **Order Management**: Track orders, view order history and details
- **Product Reviews**: Rate and review products with verified purchase badges
- **Address Management**: Save multiple shipping and billing addresses
- **Checkout Process**: Multi-step checkout with shipping and payment options
- **Payment Integration**: Paystack payment gateway integration
- **Responsive Design**: Mobile-first, fully responsive UI

### Admin Features
- **Dashboard**: Overview with key metrics and recent orders
- **Product Management**: Create, edit, delete products with variants (size/color)
- **Order Management**: View, update order status, and manage fulfillment
- **Customer Management**: View customer profiles and order history
- **Stock Monitoring**: Track inventory levels and low stock alerts
- **Financial Reports**: View sales, revenue, and financial analytics
- **Review Management**: Moderate and approve product reviews
- **Contact Messages**: Manage customer inquiries and support tickets
- **Store Settings**: Configure VAT, shipping rates, store information
- **Analytics**: View sales trends, popular products, and customer insights
- **Category Management**: Organize products by categories

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization for analytics
- **Paystack Inline JS** - Payment processing

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database with Row Level Security (RLS)
  - Authentication (email/password)
  - Edge Functions (Deno runtime)
  - Real-time subscriptions
  - Storage (for product images)

### Payment Processing
- **Paystack** - Payment gateway for African markets

### Error Monitoring
- **Honeybadger** - Error tracking and monitoring

### Deployment
- **Netlify** - Frontend hosting (configured)

## 📁 Project Structure

```
gam-shop/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── account/         # User account components
│   │   ├── admin/           # Admin dashboard components
│   │   ├── auth/            # Authentication components
│   │   ├── cart/            # Shopping cart components
│   │   ├── checkout/        # Checkout flow components
│   │   ├── contact/         # Contact form components
│   │   ├── home/            # Homepage components
│   │   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   │   ├── product/         # Product display components
│   │   ├── shared/          # Shared/common components
│   │   └── ui/              # UI primitives (buttons, inputs, etc.)
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   ├── CartContext.tsx  # Shopping cart state
│   │   └── ToastContext.tsx # Toast notifications
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── Admin/           # Admin dashboard pages
│   │   ├── Auth/            # Authentication pages
│   │   ├── Account/         # User account pages
│   │   └── ...              # Other public pages
│   ├── router/              # Routing configuration
│   ├── services/            # API service functions
│   │   ├── supabase.ts      # Supabase client
│   │   ├── auth.service.ts  # Authentication services
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   └── ...              # Other services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── constants/           # App constants (routes, etc.)
├── supabase/
│   ├── migrations/          # Database migrations
│   ├── functions/           # Edge functions
│   │   └── verify-paystack-payment/
│   └── templates/           # Email templates
├── public/                  # Static assets
└── dist/                    # Build output
```

## 🗄 Database Schema

### Core Tables

#### `profiles`
- User profiles linked to Supabase Auth
- Fields: `id`, `full_name`, `avatar_url`, `phone`, `role` (customer/admin)
- Auto-created on user signup via trigger

#### `products`
- Product catalog
- Fields: `id`, `name`, `description`, `price`, `category`, `stock`, `sku`, `images`, `featured`, etc.
- Categories: `books`, `apparel`, `accessories`

#### `product_variants`
- Size/color combinations for products
- Fields: `id`, `product_id`, `size`, `color`, `stock`, `price_adjustment`, `sku_suffix`
- Stock automatically synced to parent product

#### `product_images`
- Multiple images per product
- Fields: `id`, `product_id`, `url`, `alt_text`, `display_order`, `is_thumbnail`

#### `product_reviews`
- Customer reviews and ratings
- Fields: `id`, `product_id`, `user_id`, `rating` (1-5), `title`, `comment`, `is_verified_purchase`
- Auto-verifies purchase status

#### `cart_items`
- Persistent shopping cart
- Fields: `id`, `user_id`, `product_id`, `quantity`, `selected_size`, `selected_color`
- Unique constraint on user/product/size/color combination

#### `wishlist_items`
- User wishlists
- Fields: `id`, `user_id`, `product_id`

#### `addresses`
- User shipping/billing addresses
- Fields: `id`, `user_id`, `full_name`, `address_line1`, `city`, `state`, `postal_code`, `country`, etc.

#### `orders`
- Customer orders
- Fields: `id`, `user_id`, `order_number`, `subtotal`, `shipping`, `tax`, `total`, `status`, `payment_status`, `shipping_address` (JSONB), etc.
- Order numbers: `GAM-YYYYMMDD-####`

#### `order_items`
- Items in each order
- Fields: `id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`, `size`, `color`

#### `contact_messages`
- Contact form submissions
- Fields: `id`, `name`, `email`, `subject`, `message`, `status` (unread/read/replied/archived)

#### `store_settings`
- Store configuration
- Fields: `store_name`, `store_email`, `store_phone`, `currency`, `tax_rate`, `free_shipping_threshold`, `standard_shipping_rate`, `express_shipping_rate`

### Security
- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Admins have elevated permissions via `is_admin()` function
- Policies enforce data access rules

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Paystack account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gam-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run database migrations:
     ```bash
     # Using Supabase CLI (recommended)
     supabase db push
     
     # Or manually run migrations in order:
     # 20241218000001_auth_setup.sql
     # 20241218000002_user_addresses.sql
     # 20241218000003_admin_role.sql
     # 20241218000004_user_side_complete.sql
     # 20241218000005_admin_role_management.sql
     # 20241218000006_profiles_email.sql
     # 20241218000007_contact_messages.sql
     # 20241218000007_product_variants.sql
     # 20241218000008_product_reviews.sql
     # 20241218000010_fix_reviews_profiles_fk.sql
     # 20241218000011_store_settings.sql
     ```

4. **Set up environment variables** (see [Environment Variables](#environment-variables))

5. **Configure Paystack Edge Function**
   - In Supabase Dashboard, go to Edge Functions
   - Deploy the `verify-paystack-payment` function
   - Set `PAYSTACK_SECRET_KEY` in Edge Function secrets

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Create an admin user**
   - Register a user account through the app
   - In Supabase SQL Editor, run:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
     ```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Paystack Configuration (for frontend)
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key

# Honeybadger (optional, for error tracking)
VITE_HONEYBADGER_API_KEY=your-honeybadger-api-key
```

### Supabase Edge Function Secrets
Set these in Supabase Dashboard → Edge Functions → Secrets:
- `PAYSTACK_SECRET_KEY` - Your Paystack secret key

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Structure

- **Components**: Organized by feature/domain
- **Services**: API interaction layer, all Supabase queries here
- **Context**: Global state management (Auth, Cart, Toast)
- **Hooks**: Reusable logic extracted to custom hooks
- **Types**: TypeScript interfaces and types
- **Utils**: Helper functions and formatters

### Key Patterns

- **Service Layer**: All database operations go through service functions
- **Context Providers**: Global state for auth, cart, and notifications
- **Protected Routes**: Route guards for authentication and admin access
- **Row Level Security**: Database-level security policies
- **Type Safety**: Full TypeScript coverage

## 🚢 Deployment

### Netlify Deployment

The project is configured for Netlify deployment (`netlify.toml`):

1. **Connect repository** to Netlify
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add environment variables** in Netlify dashboard
4. **Deploy**

### Supabase Edge Functions

Deploy the Paystack verification function:

```bash
# Using Supabase CLI
supabase functions deploy verify-paystack-payment

# Set secrets
supabase secrets set PAYSTACK_SECRET_KEY=your-secret-key
```

### Database Migrations

Run migrations in production:

```bash
supabase db push
```

## 👨‍💼 Admin Features

### Dashboard
- Overview statistics (orders, revenue, products, customers)
- Recent orders widget
- Quick actions

### Product Management
- Create/edit products with rich details
- Manage product variants (size/color combinations)
- Upload multiple product images
- Set featured products
- Stock management per variant

### Order Management
- View all orders with filters
- Update order status (pending → processing → shipped → delivered)
- Update payment status
- View detailed order information
- Print/ship orders

### Customer Management
- View customer list
- View customer order history
- Customer profile details

### Stock Monitoring
- Low stock alerts
- Stock levels by product and variant
- Stock history

### Financial Reports
- Revenue analytics
- Sales trends
- Order value statistics
- Payment status overview

### Reviews Management
- Approve/reject product reviews
- View all reviews
- Moderate content

### Contact Messages
- View customer inquiries
- Mark as read/replied/archived
- Filter by status

### Store Settings
- Configure store information (name, email, phone)
- Set tax rate (VAT)
- Configure shipping rates
- Set free shipping threshold
- Currency settings

### Analytics
- Sales charts and graphs
- Popular products
- Customer insights
- Revenue trends

## 💳 Payment Integration

### Paystack Integration

The app uses Paystack for payment processing:

1. **Frontend**: Paystack Inline JS for payment initialization
2. **Backend**: Supabase Edge Function for payment verification
3. **Flow**:
   - User completes checkout
   - Payment initialized with Paystack
   - User redirected to Paystack payment page
   - After payment, redirect back to app
   - Edge function verifies payment with Paystack API
   - Order created/updated based on verification result

### Payment Status
- `pending` - Payment not yet initiated
- `paid` - Payment verified and successful
- `failed` - Payment failed
- `refunded` - Payment refunded

## 🔌 API Services

### Service Layer Overview

All database operations are abstracted through service functions:

- **`auth.service.ts`**: Authentication operations
- **`product.service.ts`**: Product CRUD, variants, images
- **`order.service.ts`**: Order creation, retrieval, updates
- **`payment.service.ts`**: Payment verification
- **`user.service.ts`**: User profile management
- **`wishlist.service.ts`**: Wishlist operations
- **`cart.service.ts`**: Cart operations (via context)
- **`review.service.ts`**: Product reviews
- **`contact.service.ts`**: Contact form submissions
- **`admin.service.ts`**: Admin-specific operations
- **`analytics.service.ts`**: Analytics and reporting

### Database Functions

PostgreSQL functions available:
- `get_cart_total(user_id)` - Calculate cart total
- `clear_user_cart(user_id)` - Clear cart after order
- `generate_order_number()` - Generate unique order numbers
- `get_product_rating(product_id)` - Get average rating
- `has_purchased_product(user_id, product_id)` - Check purchase status
- `get_store_settings()` - Get current store settings
- `is_admin()` - Check admin status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain type safety
- Follow existing code structure
- Add comments for complex logic

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com)
- UI components from [Radix UI](https://www.radix-ui.com)
- Icons from [Lucide](https://lucide.dev)
- Payment processing by [Paystack](https://paystack.com)

---

For questions or support, please contact [your-email@example.com] or open an issue on GitHub.
