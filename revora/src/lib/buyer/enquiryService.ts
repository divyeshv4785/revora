// Cloud Firestore Service for Buyer Enquiries
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { BuyerEnquiry, EnquiryStatus } from '@/types/buyer';

export const getBuyerEnquiries = async (buyerUid: string): Promise<BuyerEnquiry[]> => {
  if (!db || !buyerUid) return [];
  try {
    const q = query(
      collection(db, 'enquiries'),
      where('buyerUid', '==', buyerUid)
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as BuyerEnquiry[];
    // Sort descending by createdAt
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching buyer enquiries:', error);
    return [];
  }
};

export const createBuyerEnquiry = async (
  enquiryData: Omit<BuyerEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> => {
  if (!db) throw new Error('Firestore is not initialized');
  const now = new Date().toISOString();
  const newRef = doc(collection(db, 'enquiries'));

  const payload: BuyerEnquiry = {
    ...enquiryData,
    id: newRef.id,
    status: 'new',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(newRef, payload);
  return newRef.id;
};

export const closeBuyerEnquiry = async (enquiryId: string): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  const docRef = doc(db, 'enquiries', enquiryId);
  await updateDoc(docRef, {
    status: 'closed',
    updatedAt: new Date().toISOString(),
  });
};
