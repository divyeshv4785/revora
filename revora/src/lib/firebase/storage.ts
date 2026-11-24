// Firebase Storage Helpers for REVORA
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadUserProfileImage = async (
  uid: string,
  file: File
): Promise<string> => {
  if (!storage) throw new Error('Firebase Storage is not initialized');
  
  const fileExt = file.name.split('.').pop();
  const filePath = `users/${uid}/avatar_${Date.now()}.${fileExt}`;
  const storageRef = ref(storage, filePath);

  const uploadTask = await uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  const downloadUrl = await getDownloadURL(uploadTask.ref);
  return downloadUrl;
};
