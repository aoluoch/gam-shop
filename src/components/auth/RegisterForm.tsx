import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { ROUTES } from '@/constants/routes'

export function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const { signUp } = useAuth()
  const { error: showError, success: showSuccess } = useToast()

  const validateFullName = (name: string): string | null => {
    const trimmed = name.trim()
    if (!trimmed) {
      return 'Full name is required'
    }
    if (trimmed.length < 2) {
      return 'Full name must be at least 2 characters long'
    }
    if (trimmed.length > 100) {
      return 'Full name must be less than 100 characters'
    }
    // Check if name contains only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s'-]+$/
    if (!nameRegex.test(trimmed)) {
      return 'Full name can only contain letters, spaces, hyphens, and apostrophes'
    }
    return null
  }

  const validateEmail = (emailValue: string): string | null => {
    const trimmed = emailValue.trim()
    if (!trimmed) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address'
    }
    return null
  }

  const validatePassword = (passwordValue: string): string | null => {
    const trimmed = passwordValue.trim()
    if (!trimmed) {
      return 'Password is required'
    }
    if (trimmed.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (trimmed.length > 128) {
      return 'Password must be less than 128 characters'
    }
    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(trimmed)
    const hasNumber = /[0-9]/.test(trimmed)
    if (!hasLetter || !hasNumber) {
      return 'Password must contain at least one letter and one number'
    }
    return null
  }

  const validateConfirmPassword = (confirmValue: string, passwordValue: string): string | null => {
    const trimmed = confirmValue.trim()
    if (!trimmed) {
      return 'Please confirm your password'
    }
    if (trimmed !== passwordValue.trim()) {
      return 'Passwords do not match'
    }
    return null
  }

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)
    if (errors.fullName) {
      const error = validateFullName(value)
      setErrors(prev => ({ ...prev, fullName: error || undefined }))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (errors.email) {
      const error = validateEmail(value)
      setErrors(prev => ({ ...prev, email: error || undefined }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (errors.password) {
      const error = validatePassword(value)
      setErrors(prev => ({ ...prev, password: error || undefined }))
    }
    // Re-validate confirm password if it has a value
    if (confirmPassword && errors.confirmPassword) {
      const confirmError = validateConfirmPassword(confirmPassword, value)
      setErrors(prev => ({ ...prev, confirmPassword: confirmError || undefined }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    if (errors.confirmPassword) {
      const error = validateConfirmPassword(value, password)
      setErrors(prev => ({ ...prev, confirmPassword: error || undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Trim all fields
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    // Validate all fields
    const fullNameError = validateFullName(trimmedFullName)
    const emailError = validateEmail(trimmedEmail)
    const passwordError = validatePassword(trimmedPassword)
    const confirmPasswordError = validateConfirmPassword(trimmedConfirmPassword, trimmedPassword)

    const newErrors: {
      fullName?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}
    if (fullNameError) newErrors.fullName = fullNameError
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showError('Please correct the errors in the form before submitting', 'Validation Error')
      return
    }

    setLoading(true)
    const { error } = await signUp(trimmedEmail, trimmedPassword, trimmedFullName)
    setLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        showError('This email is already registered. Please sign in or use a different email.', 'Account Exists')
      } else {
        showError(error.message, 'Registration Failed')
      }
    } else {
      showSuccess('Account created successfully! Please check your email to verify your account.', 'Welcome to GAM Shop!')
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a confirmation link to <strong>{email}</strong>. 
            Please check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link to={ROUTES.LOGIN}>Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your details to create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={handleFullNameChange}
                onBlur={() => {
                  const error = validateFullName(fullName)
                  setErrors(prev => ({ ...prev, fullName: error || undefined }))
                }}
                className={`pl-10 ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => {
                  const error = validateEmail(email)
                  setErrors(prev => ({ ...prev, email: error || undefined }))
                }}
                className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => {
                  const error = validatePassword(password)
                  setErrors(prev => ({ ...prev, password: error || undefined }))
                }}
                className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-red-500">{errors.password}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with letters and numbers
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={() => {
                  const error = validateConfirmPassword(confirmPassword, password)
                  setErrors(prev => ({ ...prev, confirmPassword: error || undefined }))
                }}
                className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              loading || 
              !fullName.trim() || 
              !email.trim() || 
              !password.trim() || 
              !confirmPassword.trim() ||
              !!errors.fullName ||
              !!errors.email ||
              !!errors.password ||
              !!errors.confirmPassword
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
