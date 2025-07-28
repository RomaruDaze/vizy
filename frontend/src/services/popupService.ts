import { database } from "../firebase/config";
import { ref, get, set } from "firebase/database";

export const getPopupState = async (
  userId: string,
  popupType: string
): Promise<boolean> => {
  try {
    const popupRef = ref(database, `users/${userId}/popups/${popupType}`);
    const snapshot = await get(popupRef);
    return snapshot.exists() ? snapshot.val() : false;
  } catch (error) {
    console.error("Error getting popup state:", error);
    return false;
  }
};

export const setPopupState = async (
  userId: string,
  popupType: string,
  hasSeen: boolean
): Promise<void> => {
  try {
    const popupRef = ref(database, `users/${userId}/popups/${popupType}`);
    await set(popupRef, hasSeen);
  } catch (error) {
    console.error("Error setting popup state:", error);
  }
};
