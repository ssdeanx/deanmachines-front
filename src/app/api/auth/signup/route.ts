import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin'; // Import admin instances
import { FirebaseError } from 'firebase-admin'; // Import FirebaseError for typing

// Read admin emails from environment variable - ensure consistency with auth.ts
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(email => email);

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // --- Basic Input Validation ---
    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }
    // Optional: Validate name presence/format if required

    // --- Create User in Firebase Auth ---
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email: email,
        password: password,
        displayName: name || undefined, // Pass name if provided
        emailVerified: false,
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Firebase Auth createUser Error:", firebaseError.code, firebaseError.message);

      let message = 'Failed to create user account.';
      let status = 500;

      if (firebaseError.code === 'auth/email-already-exists') {
        message = 'This email address is already in use.';
        status = 409; // Conflict
      } else if (firebaseError.code === 'auth/invalid-password' || firebaseError.code === 'auth/weak-password') {
        message = 'Password is too weak or invalid (must be at least 6 characters).';
        status = 400;
      }
      return NextResponse.json({ message }, { status });
    }

    // --- Create User Document in Firestore ---
    // This ensures the user data (like role) is available for the adapter
    try {
      const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";

      await adminDb.collection('users').doc(userRecord.uid).set({
        email: userRecord.email,
        name: userRecord.displayName || '', // Use displayName from auth record
        image: userRecord.photoURL || null, // Usually null for email/pass
        role: role,
        createdAt: new Date(),
        emailVerified: null, // Align with adapter/event structure
      });

      console.log(`User ${userRecord.uid} created in Firestore with role: ${role}`);

    } catch (dbError) {
      console.error("Firestore User Creation Error:", dbError);
      // Optional: Consider deleting the Auth user if Firestore fails (rollback logic)
      // For simplicity now, we return an error indicating partial success.
      return NextResponse.json({ message: 'Account created, but failed to save user data. Please contact support.' }, { status: 500 });
    }

    // --- Success ---
    // Return minimal success info, client handles sign-in
    return NextResponse.json({ message: 'Account created successfully!' }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Signup API Error:", error);
    // Handle JSON parsing errors or other unexpected issues
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request format.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
