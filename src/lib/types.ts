import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
    role?: 'patient' | 'doctor';
}

export interface UserDocument {
    uid: string;
    email: string;
    role: 'patient' | 'doctor';
    createdAt: any;
    pendingConnections?: string[]; // Array of UIDs for pending requests
    successfulConnections?: string[]; // Array of UIDs for successful connections
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

// This is no longer needed with the new data model
export interface ConnectionRequest {
    id: string;
    doctorId: string;
    doctorEmail: string;
    patientId: string;
    status: 'pending' | 'approved' | 'denied';
    createdAt: any;
}