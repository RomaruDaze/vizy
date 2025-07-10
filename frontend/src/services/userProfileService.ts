import { ref, set, get, update } from "firebase/database";
import { database } from "../firebase/config";
import type { UserProfile } from "../types/userProfile";

export const saveUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, profileData);
    console.log("User profile saved successfully");
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
    const userSnap = await get(userRef);

    if (userSnap.exists()) {
      return userSnap.val() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    // Return null instead of throwing for permission denied
    if (error instanceof Error && error.message === "Permission denied") {
      return null;
    }
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
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
