import { 
    collection, addDoc, doc, updateDoc, deleteDoc, 
    getDocs, query, where, orderBy, serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../utils/firebase';
  
  export interface MedicineReminder {
    id?: string;
    userId: string; // Foreign key ke users
    medicineName: string;
    dosage: string;
    frequency: string; // e.g., "1x sehari", "2x sehari"
    scheduleTime: string[]; // Array waktu, misalnya ["07:00", "19:00"]
    startDate: string;
    endDate?: string; // Opsional, jika obat hanya untuk periode tertentu
    instructions?: string;
    isActive: boolean;
    createdAt?: any;
    updatedAt?: any;
  }
  
  export const addMedicineReminder = async (
    reminder: Omit<MedicineReminder, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'medicineReminders'), {
        ...reminder,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
  
      return docRef.id;
    } catch (error) {
      console.error('Error adding medicine reminder:', error);
      throw error;
    }
  };

  export const getUserMedicineReminders = async (userId: string): Promise<MedicineReminder[]> => {
    try {
      const q = query(
        collection(db, 'medicineReminders'),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
  
      const querySnapshot = await getDocs(q);
      const reminders: MedicineReminder[] = [];
      
      querySnapshot.forEach((doc) => {
        reminders.push({ 
          id: doc.id, 
          ...doc.data() 
        } as MedicineReminder);
      });
      
      return reminders;
    } catch (error) {
      console.error('Error getting medicine reminders:', error);
      throw error;
    }
  };

  export const updateMedicineReminder = async (
    id: string, 
    data: Partial<MedicineReminder>
  ): Promise<void> => {
    try {
      const reminderRef = doc(db, 'medicineReminders', id);
      await updateDoc(reminderRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating medicine reminder:', error);
      throw error;
    }
  };

  export const deactivateMedicineReminder = async (id: string): Promise<void> => {
    try {
      const reminderRef = doc(db, 'medicineReminders', id);
      await updateDoc(reminderRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deactivating medicine reminder:', error);
      throw error;
    }
  };

  export const deleteMedicineReminder = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'medicineReminders', id));
    } catch (error) {
      console.error('Error deleting medicine reminder:', error);
      throw error;
    }
  };