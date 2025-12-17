# Supabase Configuration for GAM Shop

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Migrations
You can run migrations in two ways:

#### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

#### Option B: Manual SQL Execution
1. Go to your Supabase Dashboard > SQL Editor
2. Run each migration file in order:
   - `migrations/20241218000001_auth_setup.sql`
   - `migrations/20241218000002_user_addresses.sql`
   - `migrations/20241218000003_admin_role.sql`

### 4. Configure Authentication
In your Supabase Dashboard > Authentication > URL Configuration:
- Site URL: `http://localhost:5173` (development) or your production URL
- Redirect URLs: Add `http://localhost:5173/reset-password`

### 5. Enable Email Confirmations (Optional)
In Authentication > Providers > Email:
- Enable "Confirm email" for production
- Disable for development/testing

## Database Schema

### profiles
Extends auth.users with additional user data:
- `id` - UUID (references auth.users)
- `full_name` - User's full name
- `avatar_url` - Profile picture URL
- `phone` - Phone number
- `role` - 'customer' or 'admin'
- `created_at`, `updated_at` - Timestamps

### addresses
User shipping/billing addresses:
- `id` - UUID
- `user_id` - References auth.users
- `label` - Address label (Home, Work, etc.)
- `full_name`, `phone` - Contact info
- `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country`
- `is_default` - Default address flag

## Row Level Security (RLS)
All tables have RLS enabled:
- Users can only access their own data
- Admins can access all data

## Creating an Admin User
1. Sign up through the app normally
2. Run this SQL in Supabase SQL Editor:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';
```
