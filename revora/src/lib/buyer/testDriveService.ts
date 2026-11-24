// Cloud Firestore Service for Test Drive Bookings
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { TestDriveBooking, TestDriveStatus } from '@/types/buyer';

export const getBuyerTestDrives = async (buyerUid: string): Promise<TestDriveBooking[]> => {
  if (!db || !buyerUid) return [];
  try {
    const q = query(
      collection(db, 'testDrives'),
      where('buyerUid', '==', buyerUid)
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as TestDriveBooking[];
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching test drives:', error);
    return [];
  }
};

export const requestTestDrive = async (
  data: Omit<TestDriveBooking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> => {
  if (!db) throw new Error('Firestore is not initialized');
  const now = new Date().toISOString();
  const newRef = doc(collection(db, 'testDrives'));

  const payload: TestDriveBooking = {
    ...data,
    id: newRef.id,
    status: 'requested',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(newRef, payload);
  return newRef.id;
};

export const cancelBuyerTestDrive = async (testDriveId: string): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  const docRef = doc(db, 'testDrives', testDriveId);
  await updateDoc(docRef, {
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  });
};
