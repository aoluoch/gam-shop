import { useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase";
import { AuthContext } from "./AuthContextDef";
import { SessionTimeoutModal } from "@/components/common/SessionTimeoutModal";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsModalOpen(false);
  };

  useEffect(() => {
    let activityTimer: number | undefined;
    let countdownTimer: number | undefined;
    let countdownInterval: number | undefined;

    const startCountdown = () => {
      setIsModalOpen(true);
      setCountdown(10);

      countdownInterval = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            signOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const resetTimers = () => {
      clearTimeout(activityTimer);
      clearTimeout(countdownTimer);
      clearInterval(countdownInterval);
      setIsModalOpen(false);

      activityTimer = window.setTimeout(
        () => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              startCountdown();
            }
          });
        },
        2 * 60 * 1000 - 10000,
      ); // 1 minute 50 seconds
    };

    const handleActivity = () => {
      resetTimers();
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];

    const startListeners = () => {
      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });
      resetTimers();
    };

    const stopListeners = () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(activityTimer);
      clearTimeout(countdownTimer);
      clearInterval(countdownInterval);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        startListeners();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN") {
        startListeners();
      }

      if (event === "SIGNED_OUT") {
        stopListeners();
      }
    });

    return () => {
      stopListeners();
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "PASSWORD_RECOVERY") {
        // Handle password recovery event - user clicked reset link
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Server-side validation - defense in depth
    const trimmedEmail = email?.trim() || "";
    const trimmedPassword = password?.trim() || "";
    const trimmedFullName = fullName?.trim() || "";

    if (!trimmedEmail || !trimmedPassword || !trimmedFullName) {
      return {
        error: {
          message: "All fields are required",
          name: "ValidationError",
          status: 400,
        } as import("@supabase/supabase-js").AuthError,
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        error: {
          message: "Invalid email format",
          name: "ValidationError",
          status: 400,
        } as import("@supabase/supabase-js").AuthError,
      };
    }

    // Validate password length
    if (trimmedPassword.length < 8) {
      return {
        error: {
          message: "Password must be at least 8 characters long",
          name: "ValidationError",
          status: 400,
        } as import("@supabase/supabase-js").AuthError,
      };
    }

    // Validate full name
    if (trimmedFullName.length < 2) {
      return {
        error: {
          message: "Full name must be at least 2 characters long",
          name: "ValidationError",
          status: 400,
        } as import("@supabase/supabase-js").AuthError,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
      options: {
        data: {
          full_name: trimmedFullName,
        },
      },
    });

    // Supabase returns a user with empty identities if email already exists
    // (when email confirmation is enabled, to prevent email enumeration)
    if (
      !error &&
      data.user &&
      (!data.user.identities || data.user.identities.length === 0)
    ) {
      return {
        error: {
          message: "User already registered",
          name: "AuthApiError",
          status: 400,
        } as import("@supabase/supabase-js").AuthError,
      };
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Server-side validation - defense in depth
    const trimmedEmail = email?.trim() || "";
    const trimmedPassword = password?.trim() || "";

    if (!trimmedEmail || !trimmedPassword) {
      return {
        error: {
          message: "Email and password are required",
          name: "ValidationError",
          status: 400,
        } as import("@supabase/supabase-js").AuthError,
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        error: {
          message: "Invalid email format",
          name: "ValidationError",
          status: 400,
        } as import("@supabase/supabase-js").AuthError,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    // If login succeeded, verify email is confirmed
    if (!error && data.user && !data.user.email_confirmed_at) {
      // Sign out the unverified user immediately
      await supabase.auth.signOut();
      return {
        error: {
          message: "Email not confirmed",
          name: "AuthApiError",
          status: 400,
        } as import("@supabase/supabase-js").AuthError,
      };
    }

    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  const handleStay = () => {
    // This function will be called from the modal to reset the timers
    // It's managed inside the main `useEffect` now.
    // We just need to call resetTimers() which is not exposed.
    // A simple way is to just simulate an activity.
    window.dispatchEvent(new Event("mousemove"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
      <SessionTimeoutModal
        isOpen={isModalOpen}
        onStay={handleStay}
        onLogout={signOut}
        countdown={countdown}
      />
    </AuthContext.Provider>
  );
}
