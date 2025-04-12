import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin"; // Import admin instances
import { FirebaseError } from "firebase-admin"; // Import FirebaseError for typing

// Read admin emails from environment variable - ensure consistency with auth.ts
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter((email) => email);

// Debug environment variables and initialization
console.log("API signup route initialized:", {
  adminEmailsConfigured: ADMIN_EMAILS.length > 0,
  adminAuthAvailable: !!adminAuth,
  adminDbAvailable: !!adminDb,
});

export async function POST(request: Request) {
  console.log("Signup API request received");

  try {
    const { email, password, name } = await request.json();
    console.log(
      `Processing signup request for email: ${email.substring(0, 3)}...`
    );

    // --- Basic Input Validation ---
    if (!email || typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
      console.log("Signup rejected: Invalid email format");
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      console.log("Signup rejected: Password too short");
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // --- Create User in Firebase Auth ---
    let userRecord;
    try {
      console.log("Attempting to create Firebase Auth user");
      userRecord = await adminAuth.createUser({
        email: email,
        password: password,
        displayName: name || undefined, // Pass name if provided
        emailVerified: false,
      });
      console.log(`Firebase Auth user created with ID: ${userRecord.uid}`);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error(
        "Firebase Auth createUser Error:",
        firebaseError.code,
        firebaseError.message
      );

      let message = "Failed to create user account.";
      let status = 500;

      if (firebaseError.code === "auth/email-already-exists") {
        message = "This email address is already in use.";
        status = 409; // Conflict
      } else if (
        firebaseError.code === "auth/invalid-password" ||
        firebaseError.code === "auth/weak-password"
      ) {
        message =
          "Password is too weak or invalid (must be at least 6 characters).";
        status = 400;
      } else if (firebaseError.code === "auth/invalid-email") {
        message = "Invalid email format.";
        status = 400;
      }

      return NextResponse.json(
        { message, code: firebaseError.code },
        { status }
      );
    }

    // --- Create User Document in Firestore ---
    try {
      const role = ADMIN_EMAILS.includes(email.toLowerCase())
        ? "admin"
        : "user";
      console.log(`Creating Firestore user document with role: ${role}`);

      await adminDb
        .collection("users")
        .doc(userRecord.uid)
        .set({
          email: userRecord.email,
          name: userRecord.displayName || "", // Use displayName from auth record
          image: userRecord.photoURL || null, // Usually null for email/pass
          role: role,
          createdAt: new Date(),
          emailVerified: null, // Align with adapter/event structure
        });

      console.log(
        `User ${userRecord.uid} created in Firestore with role: ${role}`
      );
    } catch (dbError) {
      console.error("Firestore User Creation Error:", dbError);
      // Consider deleting the Auth user if Firestore fails for consistent state
      try {
        console.log(
          `Attempting to delete Firebase Auth user ${userRecord.uid} due to Firestore failure`
        );
        await adminAuth.deleteUser(userRecord.uid);
        console.log(`Deleted Firebase Auth user ${userRecord.uid}`);
      } catch (deleteError) {
        console.error(
          `Failed to delete Firebase Auth user after Firestore error: ${deleteError}`
        );
      }

      return NextResponse.json(
        {
          message: "Failed to save user data. Please try again later.",
          details:
            process.env.NODE_ENV === "development"
              ? String(dbError)
              : undefined,
        },
        { status: 500 }
      );
    }

    // --- Success ---
    console.log(`Signup successful for user ${userRecord.uid}`);
    return NextResponse.json(
      {
        message: "Account created successfully!",
        userId: userRecord.uid, // Include user ID for debugging
      },
      { status: 201 }
    ); // 201 Created
  } catch (error) {
    console.error("Signup API Error:", error);
    // Handle JSON parsing errors or other unexpected issues
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request format." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "An unexpected error occurred.",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
