import type { FirestoreError } from "firebase/firestore";
import type { AuthError } from "firebase/auth";

/**
 * Type guard to check if an error is a Firebase Auth error
 */
export function isFirebaseAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("auth/")
  );
}

/**
 * Type guard to check if an error is a Firestore error
 */
export function isFirestoreError(error: unknown): error is FirestoreError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("firestore/")
  );
}

/**
 * Type guard to check if an error is a Firebase Realtime Database error
 */
export function isDatabaseError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isFirebaseAuthError(error) || isFirestoreError(error)) {
    return error.message || "Firebase operation failed";
  }

  if (isDatabaseError(error)) {
    const dbError = error as { code: string; message?: string };
    return dbError.message || `Database error: ${dbError.code}`;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred";
}

/**
 * Extract error code from Firebase errors
 */
export function getErrorCode(error: unknown): string | undefined {
  if (isFirebaseAuthError(error) || isFirestoreError(error)) {
    return error.code;
  }

  if (isDatabaseError(error)) {
    return (error as { code: string }).code;
  }

  return undefined;
}

/**
 * Common Firebase error codes
 */
export const FirebaseErrorCodes = {
  // Auth errors
  AUTH_ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL:
    "auth/account-exists-with-different-credential",
  AUTH_EMAIL_ALREADY_IN_USE: "auth/email-already-in-use",
  AUTH_INVALID_EMAIL: "auth/invalid-email",
  AUTH_WEAK_PASSWORD: "auth/weak-password",
  AUTH_WRONG_PASSWORD: "auth/wrong-password",
  AUTH_USER_NOT_FOUND: "auth/user-not-found",
  AUTH_TOO_MANY_REQUESTS: "auth/too-many-requests",
  AUTH_NETWORK_REQUEST_FAILED: "auth/network-request-failed",
  // Firestore errors
  FIRESTORE_PERMISSION_DENIED: "firestore/permission-denied",
  FIRESTORE_NOT_FOUND: "firestore/not-found",
  FIRESTORE_UNAVAILABLE: "firestore/unavailable",
  // Database errors
  DATABASE_PERMISSION_DENIED: "permission-denied",
  DATABASE_UNAVAILABLE: "unavailable",
} as const;
