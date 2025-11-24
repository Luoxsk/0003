
export type MoodType = 'happy' | 'calm' | 'tired' | 'anxious' | 'sad';

export interface MoodConfig {
  id: MoodType;
  label: string;
  cropName: string;
  emoji: string; // Using emojis as pixel art placeholders
  color: string;
  description: string;
}

export interface DailyEntry {
  date: string; // Format YYYY-MM-DD
  mood: MoodType;
  note: string;
  timestamp: number;
}

export type MoodHistory = Record<string, DailyEntry>;

export type PetType = 'cat' | 'dog' | 'rabbit' | 'hamster' | 'fox' | 'chick' | 'turtle' | 'panda';

export interface PetConfig {
  id: PetType;
  name: string;
  emoji: string;
  color: string;
}
