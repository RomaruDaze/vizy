import { database } from "../firebase/config";
import { ref, push, get, set, remove } from "firebase/database";

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  image?: string;
  actionButtons?: Array<{
    id: string;
    text: string;
    route: string;
    icon: string;
  }>;
}

export const saveConversation = async (
  userId: string,
  messages: Message[]
): Promise<string> => {
  try {
    const conversationRef = ref(database, `users/${userId}/conversations`);
    const newConversationRef = push(conversationRef);

    const conversation = {
      messages: messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(newConversationRef, conversation);
    return newConversationRef.key!;
  } catch (error) {
    console.error("Error saving conversation:", error);
    throw error;
  }
};

export const updateConversation = async (
  userId: string,
  conversationId: string,
  messages: Message[]
): Promise<void> => {
  try {
    const conversationRef = ref(
      database,
      `users/${userId}/conversations/${conversationId}`
    );

    const conversation = {
      messages: messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      })),
      updatedAt: new Date().toISOString(),
    };

    await set(conversationRef, conversation);
  } catch (error) {
    console.error("Error updating conversation:", error);
    throw error;
  }
};

export const getConversations = async (
  userId: string
): Promise<Conversation[]> => {
  try {
    const conversationsRef = ref(database, `users/${userId}/conversations`);
    const snapshot = await get(conversationsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const conversations: Conversation[] = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val() as {
        messages: Array<{
          id: string;
          text: string;
          sender: "user" | "ai";
          timestamp: string;
          image?: string;
          actionButtons?: Array<{
            id: string;
            text: string;
            route: string;
            icon: string;
          }>;
        }>;
        createdAt: string;
        updatedAt: string;
      };
      conversations.push({
        id: childSnapshot.key!,
        messages: data.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });
    });

    // Sort by most recent first
    return conversations.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  } catch (error) {
    console.error("Error getting conversations:", error);
    throw error;
  }
};

export const deleteConversation = async (
  userId: string,
  conversationId: string
): Promise<void> => {
  try {
    const conversationRef = ref(
      database,
      `users/${userId}/conversations/${conversationId}`
    );
    await remove(conversationRef);
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};
