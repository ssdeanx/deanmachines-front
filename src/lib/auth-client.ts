"use client";

/**
 * Client-side authentication utilities for static exports
 *
 * This module provides client-side authentication helpers that work with
 * static exports in Next.js, avoiding server-side dependencies.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  getIdTokenResult,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase/client";

/**
 * User interface representing the authenticated user's data
 */
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

/**
 * Authentication result interface
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Sign up a new user with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @param name - Optional user's display name
 * @returns Promise resolving to an AuthResult
 */
export async function signUp(
  email: string,
  password: string,
  name?: string
): Promise<AuthResult> {
  try {
    // Create the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Set display name if provided
    if (name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }

    // Get token result to check for admin role
    const idTokenResult = await userCredential.user.getIdTokenResult();
    const isAdmin = idTokenResult.claims.role === "admin";

    // Create user object
    const user: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name || userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      isAdmin,
    };

    // Store auth data in localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({
        authenticated: true,
        isAdmin,
        user,
      })
    );

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    let errorMessage = "An unexpected error occurred";

    // Parse Firebase error codes
    if (error instanceof Error) {
      const errorCode = (error as any).code;

      switch (errorCode) {
        case "auth/email-already-in-use":
          errorMessage = "This email address is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak (must be at least 6 characters).";
          break;
        default:
          errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Sign in an existing user with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to an AuthResult
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get user token for additional claims
    const idTokenResult = await userCredential.user.getIdTokenResult();

    // Check for admin role in token claims
    const isAdmin = idTokenResult.claims.role === "admin";

    // Create user object
    const user: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      isAdmin,
    };

    // Store auth data in localStorage for persistence
    localStorage.setItem(
      "auth",
      JSON.stringify({
        authenticated: true,
        isAdmin,
        user,
      })
    );

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    let errorMessage = "An unexpected error occurred";

    // Parse Firebase error codes
    if (error instanceof Error) {
      const errorCode = (error as any).code;

      switch (errorCode) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many failed login attempts. Please try again later.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        default:
          errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Sign out the current user
 *
 * @returns Promise resolving to an AuthResult
 */
export async function signOut(): Promise<AuthResult> {
  try {
    await firebaseSignOut(auth);

    // Clear auth data from localStorage
    localStorage.removeItem("auth");

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Sets up an auth state listener to keep the local storage and UI in sync
 * with Firebase Authentication state changes
 *
 * @returns Unsubscribe function to stop listening to auth state changes
 */
export function setupAuthListener(): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Get the ID token result for additional claims
        const idTokenResult = await getIdTokenResult(user);
        const isAdmin = idTokenResult.claims.role === "admin";

        const userData: User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAdmin,
        };

        // Update localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            authenticated: true,
            isAdmin,
            user: userData,
          })
        );

        // Dispatch event to notify components
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.error("Error processing auth state change:", error);
      }
    } else {
      // User is signed out
      localStorage.removeItem("auth");
      window.dispatchEvent(new Event("storage"));
    }
  });
}

/**
 * Get the current user from localStorage
 *
 * @returns The current user or null if not authenticated
 */
export function getCurrentUser(): User | null {
  try {
    const authData = localStorage.getItem("auth");
    if (!authData) return null;

    const parsedAuth = JSON.parse(authData);
    return parsedAuth.authenticated ? parsedAuth.user : null;
  } catch (e) {
    console.error("Error getting current user:", e);
    return null;
  }
}

/**
 * Check if a user is authenticated
 *
 * @returns Boolean indicating if a user is authenticated
 */
export function isAuthenticated(): boolean {
  try {
    const authData = localStorage.getItem("auth");
    if (!authData) return false;

    const parsedAuth = JSON.parse(authData);
    return !!parsedAuth.authenticated;
  } catch (e) {
    console.error("Error checking authentication:", e);
    return false;
  }
}

/**
 * Check if the current user is an admin
 *
 * @returns Boolean indicating if the current user is an admin
 */
export function isAdmin(): boolean {
  try {
    const authData = localStorage.getItem("auth");
    if (!authData) return false;

    const parsedAuth = JSON.parse(authData);
    return !!parsedAuth.isAdmin;
  } catch (e) {
    console.error("Error checking admin status:", e);
    return false;
  }
}
