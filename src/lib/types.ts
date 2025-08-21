import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'prescription' | 'lab_report' | 'allergy' | 'note';
  title: string;
  content: string;
  date: string; // Changed to string to be serializable
  createdAt: string; // Changed to string to be serializable
}
