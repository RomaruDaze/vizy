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
