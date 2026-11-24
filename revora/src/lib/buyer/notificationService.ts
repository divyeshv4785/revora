// Cloud Firestore Service for Buyer Notifications
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { BuyerNotification } from '@/types/buyer';

export const getBuyerNotifications = async (uid: string): Promise<BuyerNotification[]> => {
  if (!db || !uid) return [];
  try {
    const colRef = collection(db, 'notifications', uid, 'items');
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as BuyerNotification[];
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (uid: string, notificationId: string): Promise<void> => {
  if (!db || !uid) return;
  try {
    const docRef = doc(db, 'notifications', uid, 'items', notificationId);
    await updateDoc(docRef, { read: true });
  } catch (err) {
    console.warn('Mark read error:', err);
  }
};

export const markAllNotificationsAsRead = async (uid: string): Promise<void> => {
  if (!db || !uid) return;
  try {
    const colRef = collection(db, 'notifications', uid, 'items');
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
      batch.update(d.ref, { read: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn('Mark all read error:', err);
  }
};

export const deleteBuyerNotification = async (uid: string, notificationId: string): Promise<void> => {
  if (!db || !uid) return;
  try {
    const docRef = doc(db, 'notifications', uid, 'items', notificationId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Delete notification error:', err);
  }
};

export const addBuyerNotification = async (
  uid: string,
  notification: Omit<BuyerNotification, 'id' | 'createdAt' | 'uid' | 'read'>
): Promise<string> => {
  if (!db || !uid) throw new Error('Authentication required');
  const newRef = doc(collection(db, 'notifications', uid, 'items'));
  const payload: BuyerNotification = {
    ...notification,
    id: newRef.id,
    uid,
    read: false,
    createdAt: new Date().toISOString(),
  };
  await setDoc(newRef, payload);
  return newRef.id;
};
