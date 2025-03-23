/* eslint-disable @typescript-eslint/no-explicit-any */


import { 
    collection, addDoc, doc, updateDoc, deleteDoc, 
    getDocs, query, where, orderBy, serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../utils/firebase';
  
  export interface MedicalHistory {
    id?: string;
    userId: string; // Foreign key ke users
    condition: string; // Nama penyakit/kondisi
    diagnosisDate: string;
    endDate?: string; // Opsional, jika kondisi sudah sembuh
    doctorName?: string;
    hospitalName?: string;
    symptoms: string[];
    treatments?: string[];
    medications?: string[];
    notes?: string;
    isActive: boolean; // Untuk soft delete
    severity?: 'ringan' | 'sedang' | 'berat';
    createdAt?: any;
    updatedAt?: any;
  }
  
  // Tambah riwayat penyakit baru
  export const addMedicalHistory = async (
    history: Omit<MedicalHistory, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'medicalHistory'), {
        ...history,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
  
      return docRef.id;
    } catch (error) {
      console.error('Error adding medical history:', error);
      throw error;
    }
  };
  
  // Dapatkan semua riwayat penyakit untuk user tertentu
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
  
  // Update riwayat penyakit
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
  
  // Hapus riwayat penyakit (soft delete)
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
  
  // Hard delete riwayat penyakit (jarang digunakan, lebih baik soft delete)
  export const deleteMedicalHistory = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'medicalHistory', id));
    } catch (error) {
      console.error('Error deleting medical history:', error);
      throw error;
    }
  };