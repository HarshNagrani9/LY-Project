'use server';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  getDoc,
  doc,
  Timestamp,
  setDoc,
  updateDoc,
  arrayUnion,
  documentId,
} from 'firebase/firestore';
import { db } from './config';
import type { HealthRecord, UserDocument, ConnectionRequest } from '@/lib/types';

const USERS_COLLECTION = 'users';
const HEALTH_RECORDS_COLLECTION = 'healthRecords';
const SHARES_COLLECTION = 'shares';
const CONNECTION_REQUESTS_COLLECTION = 'connectionRequests';

const convertTimestamp = (data: any) => {
    if (data && data.createdAt && typeof data.createdAt.toDate === 'function') {
        return { ...data, createdAt: data.createdAt.toDate().toISOString() };
    }
    return data;
}

// Get a user document
export const getUserDocument = async (userId: string): Promise<UserDocument | null> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            // Ensure createdAt is converted if it exists
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                return { ...data, createdAt: data.createdAt.toDate().toISOString() } as UserDocument;
            }
            return data as UserDocument;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user document:", error);
        throw new Error('Failed to fetch user document.');
    }
}

// Create a user document
export const createUserDocument = async (userId: string, email: string, role: 'patient' | 'doctor') => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        await setDoc(userRef, {
            uid: userId,
            email,
            role,
            createdAt: serverTimestamp(),
            connections: [],
        });
    } catch (error) {
        console.error("Error creating user document:", error);
        throw new Error('Failed to create user document.');
    }
}


// Add a new health record for a user
export const addHealthRecord = async (
  userId: string,
  recordData: Omit<HealthRecord, 'id' | 'userId' | 'createdAt' | 'date'> & { date: Date }
) => {
  try {
    const docRef = await addDoc(collection(db, HEALTH_RECORDS_COLLECTION), {
      ...recordData,
      date: Timestamp.fromDate(recordData.date), // Convert Date to Timestamp on the server
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding health record: ', error);
    throw new Error('Failed to add health record.');
  }
};

// Get all health records for a user
export const getHealthRecords = async (userId: string): Promise<HealthRecord[]> => {
  try {
    const q = query(
      collection(db, HEALTH_RECORDS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const records = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const getDate = (timestamp: any): Date | null => {
        if (!timestamp) return null;
        if (timestamp instanceof Timestamp) {
            return timestamp.toDate();
        }
        if (typeof timestamp === 'object' && 'seconds' in timestamp && 'nanoseconds' in timestamp) {
            return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
        }
        const d = new Date(timestamp);
        if (!isNaN(d.getTime())) {
          return d;
        }
        return null;
      }
      const date = getDate(data.date);
      const createdAt = getDate(data.createdAt);
      
      return {
        id: doc.id,
        ...data,
        date: date ? date.toISOString() : new Date().toISOString(),
        createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString(),
      } as unknown as HealthRecord;
    });

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error('Error getting health records: ', error);
    throw new Error('Failed to fetch health records.');
  }
};

// Create a shareable link record
export const createShare = async (userId: string) => {
  try {
    const docRef = await addDoc(collection(db, SHARES_COLLECTION), {
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating share link: ', error);
    throw new Error('Failed to create share link.');
  }
};

// Get shared records by share ID
export const getSharedRecords = async (shareId: string) => {
  try {
    // This function is now deprecated in favor of direct access for connected doctors.
    // We will check for a patient ID directly.
    const records = await getHealthRecords(shareId);
    return { records, userId: shareId };
  } catch (error) {
    console.error('Error getting shared records: ', error);
    throw error;
  }
};

// Search for patients by email (exact match)
export const searchPatientsByEmail = async (email: string): Promise<UserDocument[]> => {
    if (!email) return [];
    try {
        const q = query(
            collection(db, USERS_COLLECTION),
            where('role', '==', 'patient'),
            where('email', '==', email)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => convertTimestamp(doc.data()) as UserDocument);
    } catch (error) {
        console.error("Error searching patients:", error);
        return [];
    }
}

// Create a connection request from a doctor to a patient
export const createConnectionRequest = async (doctorId: string, doctorEmail: string, patientId: string) => {
    try {
        // Check if they are already connected
        const doctorDoc = await getUserDocument(doctorId);
        if (doctorDoc?.connections?.includes(patientId)) {
             return { success: false, error: "You are already connected with this patient." };
        }
        
        // Check if a pending request already exists
        const q = query(collection(db, CONNECTION_REQUESTS_COLLECTION),
            where('doctorId', '==', doctorId),
            where('patientId', '==', patientId),
            where('status', '==', 'pending')
        );
        const existingRequest = await getDocs(q);
        if (!existingRequest.isEmpty) {
            return { success: false, error: "A connection request has already been sent." };
        }

        await addDoc(collection(db, CONNECTION_REQUESTS_COLLECTION), {
            doctorId,
            doctorEmail,
            patientId,
            status: 'pending',
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating connection request:", error);
        return { success: false, error: "Failed to send connection request." };
    }
}

// Get pending connection requests for a patient
export const getPendingConnectionRequests = async (patientId: string): Promise<ConnectionRequest[]> => {
    try {
        const q = query(collection(db, CONNECTION_REQUESTS_COLLECTION), 
            where('patientId', '==', patientId),
            where('status', '==', 'pending')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...convertTimestamp(data),
            } as ConnectionRequest;
        });
    } catch (error) {
        console.error("Error fetching connection requests:", error);
        return [];
    }
}

// Update the status of a connection request
export const updateConnectionRequestStatus = async (requestId: string, status: 'approved' | 'denied') => {
    try {
        const requestRef = doc(db, CONNECTION_REQUESTS_COLLECTION, requestId);
        await updateDoc(requestRef, { status });

        if (status === 'approved') {
            const requestSnap = await getDoc(requestRef);
            const requestData = requestSnap.data();
            
            if (!requestData) {
                throw new Error("Request document not found.");
            }
            const request = requestData as ConnectionRequest;

            // Add connection to both doctor and patient
            const doctorRef = doc(db, USERS_COLLECTION, request.doctorId);
            await updateDoc(doctorRef, { connections: arrayUnion(request.patientId) });

            const patientRef = doc(db, USERS_COLLECTION, request.patientId);
            await updateDoc(patientRef, { connections: arrayUnion(request.doctorId) });
        }
        return { success: true };
    } catch (error) {
        console.error(`Error updating connection request to ${status}:`, error);
        return { success: false, error: "Failed to update connection request." };
    }
}

// Get a doctor's connected patients
export const getConnectedPatients = async (doctorId: string): Promise<UserDocument[]> => {
    try {
        const doctorDoc = await getUserDocument(doctorId);
        if (!doctorDoc || !doctorDoc.connections || doctorDoc.connections.length === 0) {
            return [];
        }

        const patientIds = doctorDoc.connections;
        const patientsQuery = query(collection(db, USERS_COLLECTION), where(documentId(), 'in', patientIds));
        const querySnapshot = await getDocs(patientsQuery);

        return querySnapshot.docs.map(doc => convertTimestamp(doc.data()) as UserDocument);
    } catch (error) {
        console.error("Error getting connected patients:", error);
        return [];
    }
}

// Get a patient's connected doctors
export const getConnectedDoctors = async (patientId: string): Promise<UserDocument[]> => {
    try {
        const patientDoc = await getUserDocument(patientId);
        if (!patientDoc || !patientDoc.connections || patientDoc.connections.length === 0) {
            return [];
        }

        const doctorIds = patientDoc.connections;
        const doctorsQuery = query(collection(db, USERS_COLLECTION), where(documentId(), 'in', doctorIds));
        const querySnapshot = await getDocs(doctorsQuery);

        return querySnapshot.docs.map(doc => convertTimestamp(doc.data()) as UserDocument);
    } catch (error) {
        console.error("Error getting connected doctors:", error);
        return [];
    }
}
