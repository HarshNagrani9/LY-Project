'use server';

import {
  createShare,
  searchPatientsByEmail,
  createConnectionRequest,
  getConnectedPatients as getPatients,
  getPendingConnectionRequests as getRequests,
  updateConnectionRequestStatus as updateRequest,
  getHealthRecords,
  getUserDocument,
} from './firebase/firestore';
import { headers } from 'next/headers';
import { auth } from './firebase/config';

export async function createShareLink(userId: string) {
  if (!userId) {
    return { error: 'You must be logged in to share records.' };
  }
  try {
    const shareId = await createShare(userId);
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const shareUrl = `${protocol}://${host}/share/${shareId}`;
    return { url: shareUrl, error: null };
  } catch (error) {
    return { url: null, error: 'Failed to create share link.' };
  }
}

export { searchPatientsByEmail };

export async function requestPatientConnection(doctorId: string, doctorEmail:string, patientId: string) {
    return createConnectionRequest(doctorId, doctorEmail, patientId);
}

export async function getConnectedPatients(doctorId: string) {
    return getPatients(doctorId);
}

export async function getPendingConnectionRequests(patientId: string) {
    return getRequests(patientId);
}

export async function updateConnectionRequest(requestId: string, status: 'approved' | 'denied') {
    return updateRequest(requestId, status);
}

export async function getPatientRecordsForDoctor(patientId: string) {
    // Security check: ensure the current user (doctor) is connected to the patient
    const doctorId = auth.currentUser?.uid;
    if (!doctorId) {
        throw new Error("Authentication error. You must be logged in.");
    }

    const patientDoc = await getUserDocument(patientId);

    // Ensure the patient document exists and has a connections array
    if (!patientDoc || !Array.isArray(patientDoc.connections)) {
        throw new Error("Patient data not found or is invalid.");
    }

    // Check if the doctor's ID is in the patient's connections list
    if (!patientDoc.connections.includes(doctorId)) {
        throw new Error("You do not have permission to view these records.");
    }
    
    // If permission is granted, fetch the records
    return getHealthRecords(patientId);
}