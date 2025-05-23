"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../components/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { 
  MedicalHistory,
  getUserMedicalHistory,
  addMedicalHistory,
  updateMedicalHistory,
  deactivateMedicalHistory
} from '../utils/medicalHistory';
import PageTransition from '../components/PageTransition';

export default function MedicalHistoryPage() {
  const { userId } = useAuth();
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<MedicalHistory | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [condition, setCondition] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [severity, setSeverity] = useState<'ringan' | 'sedang' | 'berat'>('ringan');

  useEffect(() => {
    const fetchMedicalHistories = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const histories = await getUserMedicalHistory(userId);
          setMedicalHistories(histories);
        } catch (error) {
          console.error('Error fetching medical histories:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMedicalHistories();
  }, [userId]);

  const handleAddNewCondition = () => {
    // Reset form
    setCondition('');
    setDiagnosisDate('');
    setSeverity('ringan');
    
    // Open modal
    setShowAddModal(true);
  };

  const handleViewDetail = async (id: string) => {
    try {
      const docRef = doc(db, 'medicalHistory', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSelectedHistory({ id: docSnap.id, ...docSnap.data() } as MedicalHistory);
        setShowDetailModal(true);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !condition || !diagnosisDate) {
      alert('Mohon lengkapi data yang wajib diisi.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newMedicalHistory = {
        userId,
        condition,
        diagnosisDate,
        severity,
        isActive: true,
        updatedAt: new Date()
      };
      await addMedicalHistory(newMedicalHistory);

      if (userId) {
        const refreshedHistories = await getUserMedicalHistory(userId);
        setMedicalHistories(refreshedHistories);
      }

      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding medical history:', error);
      if (error instanceof Error) {
        alert(`Terjadi kesalahan saat menyimpan data: ${error.message}`);
      } else {
        alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedHistory?.id || !userId) return;
    
    setIsSubmitting(true);
    try {
      await deactivateMedicalHistory(selectedHistory.id);

      const refreshedHistories = await getUserMedicalHistory(userId);
      setMedicalHistories(refreshedHistories); 

      setShowDetailModal(false);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error removing document:", error);
      alert("Gagal menghapus riwayat penyakit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsRecovered = async () => {
    if (!selectedHistory?.id || !userId) return;
    
    setIsSubmitting(true);
    try {

      await updateMedicalHistory(selectedHistory.id, {
        isActive: false,
        updatedAt: new Date()
      });
      
      const refreshedHistories = await getUserMedicalHistory(userId);
      setMedicalHistories(refreshedHistories);

      setSelectedHistory({
        ...selectedHistory,
        isActive: false,
        updatedAt: new Date()
      });
      
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Gagal memperbarui status penyakit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | Date | { toDate?: () => Date }) => {
    if (!dateString) return '-';
    
    try {
      const date = dateString instanceof Date 
        ? dateString 
        : typeof dateString === 'object' && 'toDate' in dateString && typeof dateString.toDate === 'function'
        ? dateString.toDate()
        : new Date(dateString as string);
        
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString.toString();
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'berat':
        return 'bg-[#f77171]';
      case 'sedang':
        return 'bg-[#fde687]';
      case 'ringan':
      default:
        return 'bg-[#88edad]';
    }
  };

  const getStatusText = (history: MedicalHistory) => {
    if (!history.isActive) {
      return 'Sembuh';
    }
    
    switch (history.severity) {
      case 'berat':
        return 'Aktif';
      case 'sedang':
        return 'Dalam Perawatan';
      case 'ringan':
      default:
        return 'Aktif';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen relative bg-[#fffdf5] overflow-hidden">
      <PageTransition>
      {/* Status Bar Placeholder */}
      <div className="h-12 flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-2">
        </div>
      </div>


      <div className="w-full px-6 h-11 flex items-center relative">
        <button 
          onClick={() => router.back()} 
          className="p-1.5 bg-white rounded-lg shadow-md absolute left-6 z-10 transition-transform active:scale-90 hover:bg-gray-50"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <Image 
              src="/icon/navigate_before.svg" 
              alt="Back" 
              width={30} 
              height={16} 
            />
          </div>
        </button>
        
        {/* Title centered across entire width */}
        <div className="w-full flex justify-center">
          <h1 className="text-black text-2xl font-bold font-['Nunito_Sans'] leading-10">
            Riwayat Penyakit
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p>Memuat data...</p>
          </div>
        ) : (
          <>
            {medicalHistories.length > 0 ? (
              medicalHistories.map((history) => (
                <div 
                  key={history.id} 
                  onClick={() => handleViewDetail(history.id!)}
                  className="w-full bg-white rounded-xl shadow-md flex items-center cursor-pointer p-3 transition-transform active:scale-97 hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    {/* Indikator warna severity - versi bola */}
                    <div className={`w-5 h-5 ${getSeverityColor(history.severity)} rounded-full mr-3 flex-shrink-0`}></div>
                    
                    <div className="flex-1">
                      <h3 className="text-black text-base font-bold font-['Nunito_Sans'] leading-tight">
                        {history.condition} ({new Date(history.diagnosisDate).getFullYear()})
                      </h3>
                      <div className="space-y-0.5 mt-0.5">
                        <p className="text-black text-xs font-normal font-['Nunito_Sans']">
                          Status: {getStatusText(history)}
                        </p>
                        <p className="text-black text-xs font-normal font-['Nunito_Sans']">
                          Terakhir diperiksa: {String(formatDate(history.updatedAt || history.diagnosisDate) || '-')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-md justify-center text-center">
                <p className="text-zinc-400">Belum ada riwayat penyakit yang tersimpan</p>
              </div>
            )}

            {/* Add New Condition Card */}
            <div 
              onClick={handleAddNewCondition}
              className="w-full h-10 bg-white rounded-xl shadow-md flex items-center cursor-pointer px-4 transition-transform active:scale-95 active:shadow-sm hover:bg-gray-50"
            >
              <span className="text-zinc-400 text-base font-normal font-['Nunito_Sans'] leading-10 flex-1">
                Tambahkan riwayat penyakit
              </span>
              <span className="text-black text-xl font-bold">+</span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Space / Home Indicator */}
      <div className="w-full h-8 absolute bottom-0 overflow-hidden">
      </div>

      {/* Add Medical History Modal - With Improved Backdrop */}
      {showAddModal && (
        <>
          {/* Backdrop overlay with reduced brightness */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-brightness-75 z-40" 
            onClick={() => setShowAddModal(false)}
          />

          {/* Modal content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-xl w-[90%] max-w-sm shadow-2xl transform transition-all pointer-events-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg text-black font-bold font-['Nunito_Sans']">Tambah Riwayat Penyakit</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-transform active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
                
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Nama Penyakit */}
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1 font-['Nunito_Sans']">
                      Nama Penyakit/Kondisi *
                    </label>
                    <input
                      id="condition"
                      type="text"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      placeholder="Contoh: Diabetes, Hipertensi, dsb."
                      className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded-md font-['Nunito_Sans'] bg-white focus:bg-white"
                      required
                    />
                  </div>
                  
                  {/* Tanggal Diagnosis */}
                  <div>
                    <label htmlFor="diagnosisDate" className="block text-sm font-medium text-gray-700 mb-1 font-['Nunito_Sans']">
                      Tanggal Diagnosis *
                    </label>
                    <input
                      id="diagnosisDate"
                      type="date"
                      value={diagnosisDate}
                      onChange={(e) => setDiagnosisDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded-md font-['Nunito_Sans'] bg-white focus:bg-white"
                      required
                    />
                  </div>
                  
                  {/* Tingkat Keparahan */}
                  <div>
                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1 font-['Nunito_Sans']">
                      Tingkat Keparahan
                    </label>
                    <select
                      id="severity"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as 'ringan' | 'sedang' | 'berat')}
                      className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded-md font-['Nunito_Sans'] bg-white focus:bg-white"
                    >
                      <option value="ringan">Ringan</option>
                      <option value="sedang">Sedang</option>
                      <option value="berat">Berat</option>
                    </select>
                  </div>
                  
                  <div className="pt-3 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 text-sm rounded-md font-medium font-['Nunito_Sans'] transition-transform active:scale-95 hover:bg-gray-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-[#364c84] text-white py-2 text-sm rounded-md font-medium font-['Nunito_Sans'] disabled:bg-gray-400 transition-transform active:scale-95 hover:bg-[#2a3b68]"
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Medical History Modal - With Improved Backdrop */}
      {showDetailModal && selectedHistory && (
        <>
          {/* Backdrop overlay with reduced brightness */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-brightness-75 z-40" 
            onClick={() => {
              setShowDetailModal(false);
              setSelectedHistory(null);
              setShowConfirmDelete(false);
            }}
          />

          {/* Modal content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-xl w-[90%] max-w-sm shadow-2xl transform transition-all pointer-events-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-black font-bold font-['Nunito_Sans']">Detail Penyakit</h2>
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedHistory(null);
                    setShowConfirmDelete(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-transform active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {/* Main Info */}
                <div className="flex">
                  <div className={`w-6 h-6 ${getSeverityColor(selectedHistory.severity)} rounded-full flex-shrink-0`}></div>
                  <div className="ml-3">
                    <h2 className="text-base font-bold text-black font-['Nunito_Sans']">
                      {selectedHistory.condition} ({new Date(selectedHistory.diagnosisDate).getFullYear()})
                    </h2>
                    
                    <div className="mt-1 space-y-0.5 text-black">
                      <p className="text-xs font-normal font-['Nunito_Sans']">
                        Status: {getStatusText(selectedHistory)}
                      </p>
                      <p className="text-xs font-normal font-['Nunito_Sans']">
                        Tanggal Diagnosis: {String(formatDate(selectedHistory.diagnosisDate))}
                      </p>
                      <p className="text-xs font-normal font-['Nunito_Sans']">
                        Terakhir diperiksa: {formatDate(selectedHistory.updatedAt || selectedHistory.diagnosisDate)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                  {/* Tombol Tandai Sudah Sembuh */}
                {selectedHistory.isActive && (
                  <button
                    onClick={handleMarkAsRecovered}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-2 text-sm rounded-md font-medium font-['Nunito_Sans'] disabled:bg-gray-400 transition-transform active:scale-95 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Memproses...' : 'Tandai Sudah Sembuh'}
                  </button>
                )}

                {/* Tombol Hapus Riwayat */}
                {!showConfirmDelete ? (
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    disabled={isSubmitting}
                    className="w-full bg-white border border-red-500 text-red-500 py-2 text-sm rounded-md font-medium font-['Nunito_Sans'] disabled:opacity-50 transition-transform active:scale-95 hover:bg-red-50"
                  >
                    Hapus Riwayat
                  </button>
                ) : (
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <p className="text-xs text-red-800 mb-2 font-['Nunito_Sans']">Apakah Anda yakin ingin menghapus riwayat penyakit ini?</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="flex-1 bg-red-600 text-white py-1.5 rounded-md font-medium text-xs font-['Nunito_Sans'] disabled:bg-gray-400 transition-transform active:scale-95"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(false)}
                        disabled={isSubmitting}
                        className="flex-1 bg-gray-200 text-gray-800 py-1.5 rounded-md font-medium text-xs font-['Nunito_Sans'] disabled:opacity-50 transition-transform active:scale-95"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </PageTransition>
    </div>
  );
}