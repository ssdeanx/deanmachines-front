'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth-client"

/**
 * SignIn component for authenticating users via credentials, Google, or GitHub.
 * Handles loading states and error feedback.
 *
 * @returns {JSX.Element} The sign-in form component
 */
export default function SignIn(): JSX.Element {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isProviderLoading, setIsProviderLoading] = useState<{
    google: boolean;
    github: boolean;
  }>({ google: false, github: false })
  const router = useRouter();

  /**
   * Handles the credentials sign-in process
   *
   * @param {React.FormEvent} e - The form submit event
   */
  const handleCredentialsSignIn = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error || "Invalid email or password.")
      } else {
        // Redirect to homepage or dashboard after successful sign-in
        router.push('/')
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error("Sign-in error:", err)
    } finally {
      setIsLoading(false)
    }
  }
  /**
   * Handles sign-in with third-party providers
   *
   * @param {"google" | "github"} provider - The authentication provider
   */
  const handleProviderSignIn = async (provider: "google" | "github"): Promise<void> => {
    setError(null)
    setIsProviderLoading(prev => ({ ...prev, [provider]: true }))

    try {
      // Redirect to Firebase authentication URL for the selected provider
      // For static exports, we need to use the Firebase client SDK directly
      const { signInWithRedirect, GoogleAuthProvider, GithubAuthProvider } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase/client');

      const authProvider = provider === 'google'
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

      await signInWithRedirect(auth, authProvider);
      // The page will redirect, so we don't need to handle the result here
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`)
      console.error(`${provider} sign-in error:`, err)
      setIsProviderLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleCredentialsSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in with Email"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleProviderSignIn("google")}
          disabled={isLoading || isProviderLoading.google || isProviderLoading.github}
        >
          {isProviderLoading.google ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleProviderSignIn("github")}
          disabled={isLoading || isProviderLoading.google || isProviderLoading.github}
        >
          {isProviderLoading.github ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          GitHub
        </Button>
      </div>
    </div>
  )
}
