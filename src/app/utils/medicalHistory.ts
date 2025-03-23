import { 
    collection, addDoc, doc, updateDoc, deleteDoc, 
    getDocs, query, where, orderBy, serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../utils/firebase';
  
  export interface MedicalHistory {
    id?: string;
    userId: string;
    condition: string;
    diagnosisDate: string;
    severity: 'ringan' | 'sedang' | 'berat';
    isActive: boolean;
    updatedAt?: Date;
    createdAt?: Date;
  }
  
  
  export const addMedicalHistory = async (medicalHistory: Omit<MedicalHistory, 'id' | 'createdAt'>) => {
    try {
      const data = {
        ...medicalHistory,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'medicalHistory'), data);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
};

  export const getUserMedicalHistory = async (userId: string): Promise<MedicalHistory[]> => {
    try {
      const q = query(
        collection(db, 'medicalHistory'),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('diagnosisDate', 'desc')
      );
  
      const querySnapshot = await getDocs(q);
      const histories: MedicalHistory[] = [];
      
      querySnapshot.forEach((doc) => {
        histories.push({ 
          id: doc.id, 
          ...doc.data() 
        } as MedicalHistory);
      });
      
      return histories;
    } catch (error) {
      console.error('Error getting medical history:', error);
      throw error;
    }
  };

  export const updateMedicalHistory = async (
    id: string, 
    data: Partial<MedicalHistory>
  ): Promise<void> => {
    try {
      const historyRef = doc(db, 'medicalHistory', id);
      await updateDoc(historyRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating medical history:', error);
      throw error;
    }
  };

  export const deactivateMedicalHistory = async (id: string): Promise<void> => {
    try {
      const historyRef = doc(db, 'medicalHistory', id);
      await updateDoc(historyRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deactivating medical history:', error);
      throw error;
    }
  };

  export const deleteMedicalHistory = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'medicalHistory', id));
    } catch (error) {
      console.error('Error deleting medical history:', error);
      throw error;
    }
  };