'use server';
import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
    role?: 'patient' | 'doctor';
    weight?: number;
    height?: number;
    bloodGroup?: string;
    bmi?: number;
}

export interface UserDocument {
    uid: string;
    email: string;
    role: 'patient' | 'doctor';
    createdAt: any;
    pendingConnections?: string[];
    successfulConnections?: string[];
    weight?: number;
    height?: number;
    bloodGroup?: string;
    bmi?: number;
}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'prescription' | 'lab_report' | 'allergy' | 'note';
  title: string;
  content: string;
  date: string; 
  createdAt: string;
  bloodPressure?: string;
  pulseRate?: number;
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
