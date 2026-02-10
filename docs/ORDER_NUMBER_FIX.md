# Order Number Duplicate Key Fix

## Problem

During checkout, after successful payment, order creation was failing with:
```
duplicate key value violates unique constraint "orders_order_number_key"
```

This occurred due to race conditions when multiple concurrent requests tried to create orders simultaneously, causing the `generate_order_number()` database function to generate the same order number for different transactions.

## Solution

This fix implements a two-layer approach:

### 1. Database-Level Fix (Migration)

**File**: `supabase/migrations/20240101000000_fix_order_number_generation.sql`

The migration improves the `generate_order_number()` function to:
- Use PostgreSQL advisory locks (`pg_advisory_xact_lock`) to ensure atomicity
- Only one transaction can generate an order number at a time
- Includes retry logic within the function for edge cases
- Falls back to timestamp-based generation if needed

**Key Features**:
- ✅ Thread-safe order number generation
- ✅ Prevents race conditions at the database level
- ✅ Maintains the same order number format: `GAM-YYYYMMDD-####`
- ✅ No breaking changes

### 2. Client-Side Improvements

**File**: `src/services/order.service.ts`

Enhanced error handling:
- Detects duplicate key errors using PostgreSQL error code `23505` (unique_violation)
- Improved error message pattern matching
- Retry logic with exponential backoff (up to 5 attempts)
- Idempotent order creation (checks for existing order by payment reference)

## How to Apply

### Step 1: Apply Database Migration

**Option A: Using Supabase CLI** (Recommended)
```bash
cd /home/amosoluoch/Desktop/gam-shop
supabase db push
```

**Option B: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy contents of `supabase/migrations/20240101000000_fix_order_number_generation.sql`
4. Paste and execute

**Option C: Manual SQL Execution**
```bash
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/20240101000000_fix_order_number_generation.sql
```

### Step 2: Verify Migration

Run this SQL to verify the function was updated:
```sql
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'generate_order_number';
```

You should see the function includes `pg_advisory_xact_lock`.

### Step 3: Test Order Creation

The client-side code is already updated. Test by:
1. Going through checkout
2. Completing payment
3. Verifying order is created successfully

## How It Works

### Before (Problem)
```
Request 1: generate_order_number() → "GAM-20251231-0001"
Request 2: generate_order_number() → "GAM-20251231-0001" (same!)
Request 1: INSERT order → ✅ Success
Request 2: INSERT order → ❌ Duplicate key error
```

### After (Fixed)
```
Request 1: Acquires lock → generate_order_number() → "GAM-20251231-0001" → INSERT → ✅
Request 2: Waits for lock → generate_order_number() → "GAM-20251231-0002" → INSERT → ✅
```

The advisory lock ensures Request 2 waits until Request 1 completes, preventing collisions.

## Rollback (If Needed)

If you need to rollback the migration:

```sql
-- Restore original function (adjust based on your original implementation)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
-- Your original function code here
$$;
```

## Testing

After applying the fix, test with:
1. **Single order**: Normal checkout flow
2. **Concurrent orders**: Multiple users checking out simultaneously
3. **Rapid retries**: User clicking submit multiple times quickly
4. **Payment callback retries**: Simulate payment gateway calling callback multiple times

## Support

If issues persist after applying this fix:
1. Check Supabase logs for errors
2. Verify the migration was applied successfully
3. Check browser console for detailed error messages
4. Ensure the `generate_order_number()` function exists and is callable

## Files Changed

- ✅ `supabase/migrations/20240101000000_fix_order_number_generation.sql` (NEW)
- ✅ `src/services/order.service.ts` (UPDATED)
- ✅ `supabase/migrations/README.md` (NEW)
