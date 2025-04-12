'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { signUp, signIn } from "@/lib/auth-client";

/**
 * SignUp component for registering users via credentials, Google, or GitHub.
 * Handles form submission, validation, API calls, and redirects.
 */
export default function SignUp(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProviderLoading, setIsProviderLoading] = useState<{
    google: boolean;
    github: boolean;
  }>({ google: false, github: false });

  const router = useRouter();
  /**
   * Handles credentials signup process
   *
   * @param {React.FormEvent} e - The form submit event
   */
  const handleCredentialsSignUp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // Use our client-side signUp utility
      const signUpResult = await signUp(email, password, name);

      if (!signUpResult.success) {
        setError(signUpResult.error || "Sign-up failed. Please try again.");
      } else {
        setSuccess("Account created successfully!");
        console.log("Sign-up and auto-login successful, redirecting to dashboard");

        // Short delay to show success message
        setTimeout(() => {
          router.push('/'); // Redirect to homepage after successful sign-up
        }, 1500);
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Handles sign up/in with third-party providers
   *
   * @param {"google" | "github"} provider - The authentication provider
   */
  const handleProviderSignIn = async (provider: "google" | "github"): Promise<void> => {
    setError(null);
    setSuccess(null);
    setIsProviderLoading(prev => ({ ...prev, [provider]: true }));

    try {
      // For static exports, use Firebase auth directly
      const { signInWithRedirect, GoogleAuthProvider, GithubAuthProvider } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase/client');

      const authProvider = provider === 'google'
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

      await signInWithRedirect(auth, authProvider);
      // The page will redirect, so we don't need to handle the result here
    } catch (err) {
      console.error(`${provider} sign-in error:`, err);
      setError(`Failed to sign up with ${provider}. Please try again.`);
      setIsProviderLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert variant="default" className="mb-4 border-green-500 text-green-700 [&>svg]:text-green-700 dark:border-green-700 dark:text-green-400 dark:[&>svg]:text-green-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSignUp} className="space-y-4">
        {/* Name Field - Now enabled */}
        <div className="space-y-2">
          <Label htmlFor="name-signup">Name (Optional)</Label>
          <Input
            id="name-signup"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-signup">Email *</Label>
          <Input
            id="email-signup"
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-signup">Password *</Label>
          <Input
            id="password-signup"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={6}
            aria-describedby="password-hint"
          />
          <p id="password-hint" className="text-xs text-muted-foreground">Must be at least 6 characters long.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password *</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isProviderLoading.google || isProviderLoading.github || !email || !password || password !== confirmPassword}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Sign up with Email"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
        </div>
      </div>

      {/* Provider Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleProviderSignIn("google")}
          disabled={isLoading || isProviderLoading.google || isProviderLoading.github}
          aria-label="Sign up with Google"
        >
          {isProviderLoading.google ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path fill="currentColor" d="M21.35 11.1h-9.35v2.4h5.4c-.2 1.2-1 2.7-2.8 3.8v2h2.7c1.6-1.5 2.6-3.8 2.6-6.4c0-.6-.1-1.2-.2-1.8zM12 22c2.8 0 5.2-1 7-2.7l-2.7-2c-.8.5-1.9.8-3.3.8c-2.5 0-4.7-1.7-5.5-4H3.7v2.1C5.2 19.8 8.3 22 12 22zM3.7 10.9v-2h8.6c.1-.3.2-.7.2-1.1c0-2.6-1.7-4.9-4.3-4.9C7.5 3 5.1 4.8 3.8 7.1L1.1 5.1C2.9 2.3 6.1 0 10.1 0c3.5 0 6.5 1.2 8.8 3.4l-2.8 2.8C15.3 5.4 13.8 5 12 5c-2 0-3.7.7-5 1.9l2.7 2.1c.1-.3.1-.6.1-.9z"></path>
            </svg>
          )}
          Google
        </Button>

        <Button
          variant="outline"
          onClick={() => handleProviderSignIn("github")}
          disabled={isLoading || isProviderLoading.google || isProviderLoading.github}
          aria-label="Sign up with GitHub"
        >
          {isProviderLoading.github ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627.297 12 .297z"></path>
            </svg>
          )}
          GitHub
        </Button>
      </div>
    </div>
  );
}
