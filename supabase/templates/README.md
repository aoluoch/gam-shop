# GAM Shop Email Templates

These email templates are designed for use with Supabase Authentication.

## How to Use These Templates

### 1. Go to Supabase Dashboard
Navigate to **Authentication** → **Email Templates**

### 2. Copy Template Content
For each template type, copy the HTML content and paste it into the corresponding template in Supabase:

| File | Supabase Template |
|------|-------------------|
| `confirm_signup.html` | Confirm signup |
| `reset_password.html` | Reset password |
| `magic_link.html` | Magic link |
| `change_email.html` | Change email address |

### 3. Configure Email Settings
In **Authentication** → **Email Templates**:
- **Subject line** suggestions:
  - Confirm signup: `Welcome to GAM Shop - Verify Your Email`
  - Reset password: `Reset Your GAM Shop Password`
  - Magic link: `Sign In to GAM Shop`
  - Change email: `Confirm Your New Email - GAM Shop`

### 4. SMTP Settings (Recommended for Production)
For production, configure a custom SMTP provider in **Settings** → **Authentication**:
- Recommended providers: SendGrid, Mailgun, AWS SES, Resend
- This ensures better deliverability and removes Supabase branding

## Template Variables
Supabase provides these variables for use in templates:
- `{{ .ConfirmationURL }}` - The verification/action URL
- `{{ .Token }}` - The token (if needed separately)
- `{{ .TokenHash }}` - Hashed token
- `{{ .Data.full_name }}` - User metadata (if provided during signup)
- `{{ .Email }}` - User's email address

## Customization
Feel free to customize:
- Colors (primary: `#7c3aed` - purple)
- Logo and branding
- Copy/messaging
- Additional information or links

## Testing
1. Enable email confirmations in development
2. Use Supabase's Inbucket (local development) or check your email
3. Verify all links work correctly
