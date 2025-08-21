export interface UserProfile {
  deadline?: string;
  visaType?: string;
  purpose?: string;
  purpose_target?: string;
  documents?: string[];
  experience?: string;
  reminderDate?: string;
  reminderTime?: string;
  reminderSet?: boolean;
  documentProgress?: {
    [key: string]: boolean;
  };
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  createdAt: string;
}
