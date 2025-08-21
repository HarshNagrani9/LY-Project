'use server';

import { createShare, searchPatientsByEmail as searchPatients, connectDoctorToPatient as connect, getConnectedPatients as getPatients } from './firebase/firestore';
import { headers } from 'next/headers';

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

export async function searchPatients(email: string) {
    return searchPatients(email);
}

export async function connectDoctorToPatient(doctorId: string, patientId: string) {
    return connect(doctorId, patientId);
}

export async function getConnectedPatients(doctorId: string) {
    return getPatients(doctorId);
}