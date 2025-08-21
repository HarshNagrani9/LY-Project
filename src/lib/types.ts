import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
    role?: 'patient' | 'doctor';
}

export interface UserDocument {
    uid: string;
    email: string;
    role: 'patient' | 'doctor';
    createdAt: any;
}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'prescription' | 'lab_report' | 'allergy' | 'note';
  title: string;
  content: string;
  date: string; 
  createdAt: string; 
}
