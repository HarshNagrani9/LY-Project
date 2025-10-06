'use server';

import {
  createShare,
  searchPatientsByEmail,
  createConnectionRequest as createRequest,
  getConnectedPatients as getPatients,
  getPendingConnections,
  updateConnectionRequest as updateRequest,
  getHealthRecords,
  getUserDocument as getUser,
  getConnectedDoctors,
} from './firebase/firestore';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

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

export { searchPatientsByEmail, getConnectedDoctors, getUser as getUserDocument };

export async function requestPatientConnection(doctorId: string, patientId: string) {
    const result = await createRequest(doctorId, patientId);
    if(result.success) {
        revalidatePath('/doctor/patients');
    }
    return result;
}

export async function getConnectedPatients(doctorId: string) {
    return getPatients(doctorId);
}

export async function getPendingConnectionRequests(patientId: string) {
    return getPendingConnections(patientId);
}

export async function updateConnectionRequest(patientId: string, doctorId: string, status: 'approved' | 'denied') {
    const result = await updateRequest(patientId, doctorId, status);
    if(result.success) {
        revalidatePath('/dashboard');
        revalidatePath('/doctor/dashboard');
    }
    return result;
}

export async function getPatientRecordsForDoctor(doctorId: string, patientId: string) {
    // Security check: ensure the current user (doctor) is connected to the patient
    if (!doctorId) {
        throw new Error("Authentication error. You must be logged in.");
    }

    const doctorDoc = await getUser(doctorId);

    if (!doctorDoc || !doctorDoc.successfulConnections?.includes(patientId)) {
        throw new Error("You do not have permission to view these records.");
    }
    
    // If permission is granted, fetch the records
    return getHealthRecords(patientId);
}
