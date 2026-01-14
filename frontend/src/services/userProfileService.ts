import { ref, set, get, update } from "firebase/database";
import { database } from "../firebase/config";

export interface UserProfile {
  deadline?: string;
  ResidencyType?: string;
  purpose?: string;
  purpose_target?: string;
  documents?: string[];
  experience?: string;
  language?: "en" | "ja" | "id"; // Add "id" for Indonesian
  [key: string]: string | string[] | undefined;
}

export const saveUserProfile = async (userId: string, data: UserProfile) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, data);
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, updates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateUserLanguage = async (
  userId: string,
  language: "en" | "ja" | "id" // Add "id" to the type
) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      language: language,
    });
  } catch (error) {
    console.error("Error updating user language:", error);
    throw error;
  }
};
