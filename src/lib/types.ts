import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
    role?: 'patient' | 'doctor';
}

export interface UserDocument {
    uid: string;
    email: string;
    role: 'patient' | 'doctor';
    createdAt: any;
    connections?: string[]; // Array of patient UIDs for doctors or doctor UIDs for patients
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

export interface ConnectionRequest {
    id: string;
    doctorId: string;
    doctorEmail: string;
    patientId: string;
    status: 'pending' | 'approved' | 'denied';
    createdAt: any;
}
