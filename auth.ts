import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { initFirestore } from "@auth/firebase-adapter";
import { initializeApp } from "firebase-admin/app";
import { auth as firebaseAuth } from "@/lib/firebase/client";
import { readFileSync } from "fs";
import { getFirestore } from "firebase-admin/firestore";

// Read Firebase Admin credentials from the JSON file
const serviceAccount = JSON.parse(
  readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS!, "utf8")
);

// Initialize Firebase Admin with service account
const firebaseAdmin = initializeApp({
  credential: cert(serviceAccount),
});

const firestore = initFirestore(firebaseAdmin);
const db = getFirestore(firebaseAdmin);

// List of admin email addresses (consider moving to env or database)
const ADMIN_EMAILS = ["admin@deanmachines.com"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: FirestoreAdapter(firestore),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials exist and are strings
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            credentials.email,
            credentials.password
          );

          if (userCredential.user) {
            // Get user role from Firestore
            const userDoc = await db
              .collection("users")
              .doc(userCredential.user.uid)
              .get();
            const userData = userDoc.data();

            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
              image: userCredential.user.photoURL,
              role: userData?.role || "user",
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  events: {
    async createUser({ user }) {
      // Ensure user.id exists before proceeding
      if (!user.id) {
        console.error("Cannot create user in Firestore: user ID is missing.");
        return;
      }
      // Set role as admin for predefined admin emails, otherwise as user
      const role = ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")
        ? "admin"
        : "user";

      // Store role in Firestore
      if (!user.id) return;
      await db.collection("users").doc(user.id).set(
        {
          role,
          email: user.email,
          name: user.name,
        },
        { merge: true }
      );
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        // Check if user and user.id exist
        token.uid = user.id;
        // If signing in first time or role is missing, get role from Firestore
        if (!token.role) {
          try {
            if (!user.id) return token;
            const userDoc = await db.collection("users").doc(user.id).get();
            const userData = userDoc.data();
            token.role = userData?.role || "user";
          } catch (error) {
            console.error("Error fetching user role from Firestore:", error);
            // Assign a default role or handle the error appropriately
            token.role = "user";
          }
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
