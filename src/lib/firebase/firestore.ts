'use server';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  getDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { HealthRecord } from '@/lib/types';

const HEALTH_RECORDS_COLLECTION = 'healthRecords';
const SHARES_COLLECTION = 'shares';

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
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    // Convert Firestore Timestamps to serializable Date objects
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const date = (data.date as Timestamp)?.toDate();
      const createdAt = (data.createdAt as Timestamp)?.toDate();
      return {
        id: doc.id,
        ...data,
        date: date ? date.toISOString() : new Date().toISOString(),
        createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString(),
      } as unknown as HealthRecord;
    });
  } catch (error) {
    console.error('Error getting health records: ', error);
    throw error;
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
    const shareDocRef = doc(db, SHARES_COLLECTION, shareId);
    const shareDocSnap = await getDoc(shareDocRef);

    if (!shareDocSnap.exists()) {
      throw new Error('Share link not found or has expired.');
    }

    const { userId } = shareDocSnap.data();
    const records = await getHealthRecords(userId);
    return { records, userId };
  } catch (error) {
    console.error('Error getting shared records: ', error);
    throw error;
  }
};
