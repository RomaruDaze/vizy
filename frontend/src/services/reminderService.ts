import { ref, set, get, update, push, remove } from "firebase/database";
import { database } from "../firebase/config";

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  createdAt: string;
}

export const createReminder = async (
  userId: string,
  reminder: Omit<Reminder, "id" | "createdAt">
) => {
  try {
    const remindersRef = ref(database, `users/${userId}/reminders`);
    const newReminderRef = push(remindersRef);
    const newReminder = {
      ...reminder,
      id: newReminderRef.key!,
      createdAt: new Date().toISOString(),
    };

    await set(newReminderRef, newReminder);
    return newReminder;
  } catch (error) {
    console.error("Error creating reminder:", error);
    throw error;
  }
};

export const getUserReminders = async (userId: string): Promise<Reminder[]> => {
  try {
    const remindersRef = ref(database, `users/${userId}/reminders`);
    const snapshot = await get(remindersRef);

    if (snapshot.exists()) {
      const reminders = snapshot.val() as Record<string, Reminder>;
      return Object.values(reminders).sort(
        (a, b) =>
          new Date(a.date + " " + a.time).getTime() -
          new Date(b.date + " " + b.time).getTime()
      );
    }
    return [];
  } catch (error) {
    console.error("Error getting user reminders:", error);
    throw error;
  }
};

export const updateReminder = async (
  userId: string,
  reminderId: string,
  updates: Partial<Reminder>
) => {
  try {
    const reminderRef = ref(
      database,
      `users/${userId}/reminders/${reminderId}`
    );
    await update(reminderRef, updates);
  } catch (error) {
    console.error("Error updating reminder:", error);
    throw error;
  }
};

export const deleteReminder = async (userId: string, reminderId: string) => {
  try {
    const reminderRef = ref(
      database,
      `users/${userId}/reminders/${reminderId}`
    );
    await remove(reminderRef);
  } catch (error) {
    console.error("Error deleting reminder:", error);
    throw error;
  }
};

export const toggleReminderComplete = async (
  userId: string,
  reminderId: string,
  completed: boolean
) => {
  try {
    const reminderRef = ref(
      database,
      `users/${userId}/reminders/${reminderId}`
    );
    await update(reminderRef, { completed });
  } catch (error) {
    console.error("Error toggling reminder completion:", error);
    throw error;
  }
};
