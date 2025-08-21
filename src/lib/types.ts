import type { Timestamp } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'prescription' | 'lab_report' | 'allergy' | 'note';
  title: string;
  content: string;
  date: Timestamp;
  createdAt: Timestamp;
}
