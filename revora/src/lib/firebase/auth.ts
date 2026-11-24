// Firebase Authentication Helpers for REVORA
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  User,
  ConfirmationResult,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

// 1. Email & Password Registration
export const registerWithEmail = async (
  email: string,
  pass: string,
  displayName: string
): Promise<User> => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  if (credential.user) {
    await updateProfile(credential.user, { displayName });
    // Send verification email automatically
    await sendEmailVerification(credential.user);
  }
  return credential.user;
};

// 2. Email & Password Login
export const loginWithEmail = async (
  email: string,
  pass: string
): Promise<User> => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return credential.user;
};

// 3. Resend Verification Email
export const resendVerificationEmail = async (user: User): Promise<void> => {
  await sendEmailVerification(user);
};

// 4. Indian Phone Number Formatter & Validator
export interface PhoneValidationResult {
  formatted: string;       // +919876543210
  display: string;         // +91 98765 43210
  digits: string;          // 9876543210
  isValid: boolean;
  errorMessage?: string;
}

export const formatIndianPhoneNumber = (input: string): PhoneValidationResult => {
  if (!input || !input.trim()) {
    return { formatted: '', display: '', digits: '', isValid: false, errorMessage: 'Please enter an Indian mobile number.' };
  }

  let cleaned = input.trim().replace(/[^\d+]/g, '');

  // Strip leading international prefix
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('0091')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  const digits = cleaned.replace(/\D/g, '');

  if (digits.length === 0) {
    return { formatted: '', display: '', digits: '', isValid: false, errorMessage: 'Please enter a 10-digit mobile number.' };
  }

  if (digits.length !== 10) {
    return {
      formatted: `+91${digits}`,
      display: `+91 ${digits}`,
      digits,
      isValid: false,
      errorMessage: `Indian mobile number must be 10 digits (currently ${digits.length}).`,
    };
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return {
      formatted: `+91${digits}`,
      display: `+91 ${digits}`,
      digits,
      isValid: false,
      errorMessage: 'Indian mobile numbers must start with 6, 7, 8, or 9.',
    };
  }

  return {
    formatted: `+91${digits}`,
    display: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
    digits,
    isValid: true,
  };
};

// Global in-memory / session state holder for active OTP verification
let activeConfirmationResult: ConfirmationResult | null = null;
let activePhoneNumber: string = '';

export const setActiveConfirmationResult = (result: ConfirmationResult, phone: string): void => {
  activeConfirmationResult = result;
  activePhoneNumber = phone;
  if (typeof window !== 'undefined') {
    (window as any).__revora_confirmation_result = result;
    (window as any).__revora_phone_number = phone;
  }
};

export const getActiveConfirmationResult = (): { result: ConfirmationResult | null; phone: string } => {
  if (activeConfirmationResult) {
    return { result: activeConfirmationResult, phone: activePhoneNumber };
  }
  if (typeof window !== 'undefined' && (window as any).__revora_confirmation_result) {
    return {
      result: (window as any).__revora_confirmation_result,
      phone: (window as any).__revora_phone_number || '',
    };
  }
  return { result: null, phone: '' };
};

export const clearActiveConfirmationResult = (): void => {
  activeConfirmationResult = null;
  activePhoneNumber = '';
  if (typeof window !== 'undefined') {
    delete (window as any).__revora_confirmation_result;
    delete (window as any).__revora_phone_number;
  }
};

// 5. Setup reCAPTCHA Verifier for Phone OTP
export const setupPhoneRecaptcha = (
  containerId: string,
  size: 'invisible' | 'normal' = 'invisible',
  onSolved?: () => void
): RecaptchaVerifier => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  if (typeof window === 'undefined') throw new Error('reCAPTCHA requires browser environment');
  
  // Clear any existing verifier on container
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      // Ignore cleanup error
    }
    (window as any).recaptchaVerifier = null;
  }

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size,
    callback: () => {
      onSolved?.();
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA token expired. Please try again.');
    },
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
};

// 6. Send Phone OTP
export const sendPhoneOtpCode = async (
  phoneNumber: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  if (!auth) throw new Error('Firebase Auth is not initialized');

  const validation = formatIndianPhoneNumber(phoneNumber);
  if (!validation.isValid) {
    throw new Error(validation.errorMessage || 'Invalid Indian mobile number.');
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, validation.formatted, verifier);
    setActiveConfirmationResult(confirmationResult, validation.formatted);
    return confirmationResult;
  } catch (error: any) {
    console.error('Firebase sendPhoneOtpCode error:', error);
    let message = 'Failed to dispatch OTP code. Please check your network and mobile number.';
    if (error.code === 'auth/invalid-phone-number') {
      message = 'Invalid mobile number format. Please ensure 10 valid digits.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many OTP requests from this device. Please wait a few minutes before trying again.';
    } else if (error.code === 'auth/quota-exceeded') {
      message = 'SMS quota reached. Please try again later or contact support.';
    } else if (error.code === 'auth/captcha-check-failed') {
      message = 'reCAPTCHA check failed. Please refresh the page and try again.';
    } else if (error.message) {
      message = error.message;
    }
    const err = new Error(message);
    (err as any).code = error.code;
    throw err;
  }
};

// 7. Verify Phone OTP & Directly Sign In User
export const confirmPhoneOtpSignIn = async (
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<User> => {
  if (!otpCode || otpCode.trim().length !== 6) {
    throw new Error('Please enter the complete 6-digit OTP verification code.');
  }

  try {
    const credential = await confirmationResult.confirm(otpCode.trim());
    return credential.user;
  } catch (error: any) {
    console.error('Firebase confirmPhoneOtpSignIn error:', error);
    let message = 'Verification failed. Please check the OTP code.';
    if (error.code === 'auth/invalid-verification-code') {
      message = 'Incorrect 6-digit OTP code. Please double-check and re-enter.';
    } else if (error.code === 'auth/code-expired') {
      message = 'The verification code has expired. Please click Resend OTP to receive a new code.';
    } else if (error.code === 'auth/session-expired') {
      message = 'Your verification session has expired. Please request a new OTP.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many invalid attempts. Please wait a moment before trying again.';
    } else if (error.message) {
      message = error.message;
    }
    const err = new Error(message);
    (err as any).code = error.code;
    throw err;
  }
};

// 8. Verify Phone OTP & Link to existing Email User
export const verifyAndLinkPhoneOtp = async (
  user: User,
  verificationId: string,
  otpCode: string
): Promise<User> => {
  if (!otpCode || otpCode.trim().length !== 6) {
    throw new Error('Please enter the complete 6-digit OTP verification code.');
  }

  const credential = PhoneAuthProvider.credential(verificationId, otpCode.trim());
  try {
    // Link phone credential to the current authenticated user without changing UID
    const userCredential = await linkWithCredential(user, credential);
    return userCredential.user;
  } catch (error: any) {
    console.error('Firebase verifyAndLinkPhoneOtp error:', error);
    let message = 'Failed to link phone number.';
    if (
      error.code === 'auth/credential-already-in-use' ||
      error.code === 'auth/account-exists-with-different-credential'
    ) {
      message =
        'This mobile number is already associated with another REVORA account. Please use a different mobile number or sign in directly with this mobile number.';
    } else if (error.code === 'auth/invalid-verification-code') {
      message = 'Incorrect 6-digit OTP code. Please double-check and re-enter.';
    } else if (error.code === 'auth/code-expired') {
      message = 'The verification code has expired. Please request a new OTP.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many failed verification attempts. Please wait a few minutes before trying again.';
    } else if (error.message) {
      message = error.message;
    }
    const err = new Error(message);
    (err as any).code = error.code;
    throw err;
  }
};

// 7. Send Password Reset Email
export const requestPasswordReset = async (email: string): Promise<void> => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  await sendPasswordResetEmail(auth, email);
};

// 8. Confirm Password Reset with Code
export const executePasswordReset = async (
  oobCode: string,
  newPass: string
): Promise<void> => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  await firebaseConfirmPasswordReset(auth, oobCode, newPass);
};

// 9. Sign Out
export const logoutFromFirebase = async (): Promise<void> => {
  if (!auth) return;
  await signOut(auth);
};
