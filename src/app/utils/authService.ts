import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserData {
  id: string; 
  name?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  birthdate?: string;
  gender?: string;
  NIK?: string;
  nationality?: string;
  isMedicalStaff?: boolean;
  createdAt?: string | object;
  updatedAt?: string | object;
  surveyAnswers?: { [key: number]: string };
  [key: string]: any; // Untuk field lain yang mungkin ditambahkan nanti
}

export interface UserRegistrationData {
  name: string;
  phone: string;
  emergencyContact: string;
  birthdate?: string;
  gender?: string;
  NIK?: string;
  nationality?: string;
  isMedicalStaff?: boolean;
}

export const registerUser = async (
  email: string, 
  password: string,
  userData: {
    name: string;
    phone: string;
    emergencyContact: string;
  }
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    const userId = user.uid;

    await setDoc(doc(db, 'users', userId), {
      id: userId, 
      name: userData.name,
      email: user.email,
      phone: userData.phone,
      emergencyContact: userData.emergencyContact,
      birthdate: '',
      gender: '',
      NIK: '',
      nationality: '',
      isMedicalStaff: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: userId
      } as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserData>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const isUserProfileComplete = async (userId: string): Promise<boolean> => {
  try {
    const userData = await getUserData(userId);
    
    if (!userData) return false;
i
    return !!(
      userData.birthdate && 
      userData.gender && 
      userData.NIK && 
      userData.nationality
    );
  } catch (error) {
    console.error('Error checking user profile:', error);
    return false;
  }
};