"use client";

import React, { useState, useEffect } from 'react';
import Popup from './Popup'; // Menggunakan komponen Popup yang sudah ada
import hospitals from '../../data/hospitals'; // Mengimpor data rumah sakit
import { useAuth } from '../components/AuthProvider'; // Untuk mendapatkan data user

interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  emergencyContact: string;
  latitude: number;
  longitude: number;
  // tambahkan properti lain yang dibutuhkan
}

interface TombolDaruratProps {
  onSuccess?: (hospital: Hospital) => void;
  onError?: (error: string) => void;
  customMessage?: string;
  showResultPopup?: boolean;
}

const TombolDarurat: React.FC<TombolDaruratProps> = ({
  onSuccess,
  onError,
  customMessage,
  showResultPopup = true
}) => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nearestHospital, setNearestHospital] = useState<Hospital | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupVariant, setPopupVariant] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  // Fungsi untuk menghitung jarak antara dua titik koordinat (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius bumi dalam km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Jarak dalam km
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  // Fungsi untuk mencari rumah sakit terdekat
  const findNearestHospital = (latitude: number, longitude: number): Hospital | null => {
    if (!hospitals || hospitals.length === 0) {
      throw new Error('Data rumah sakit tidak tersedia');
    }

    let nearestHospital: Hospital | null = null;
    let shortestDistance = Infinity;

    hospitals.forEach((hospital) => {
      if (hospital.latitude && hospital.longitude) {
        const distance = calculateDistance(
          latitude, 
          longitude, 
          hospital.latitude, 
          hospital.longitude
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestHospital = hospital;
        }
      }
    });

    return nearestHospital;
  };

  // Fungsi untuk mendapatkan lokasi pengguna
  const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung oleh browser Anda'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };

  // Fungsi untuk mengirim pesan darurat ke WhatsApp
  const sendEmergencyMessage = (hospital: Hospital) => {
    const userName = user?.name || 'Pengguna';
    const userAge = user?.birthdate ? calculateAge(user.birthdate) : 'tidak diketahui';
    const userConditions = user?.medicalConditions ? user.medicalConditions.join(', ') : 'tidak ada';

    // Buat pesan darurat
    const message = customMessage || 
      `DARURAT! Saya ${userName}, usia ${userAge} tahun, membutuhkan bantuan medis segera.` +
      (userLocation ? `\nLokasi saya: https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}` : '') +
      `\nKondisi medis saya: ${userConditions}` +
      `\nMohon bantuan segera!`;

    // Format nomor telepon untuk WhatsApp
    let phoneNumber = hospital.emergencyContact || hospital.phone;
    phoneNumber = phoneNumber.replace(/\D/g, ''); // Hapus semua karakter non-digit
    if (!phoneNumber.startsWith('62')) {
      phoneNumber = phoneNumber.startsWith('0') ? `62${phoneNumber.substring(1)}` : `62${phoneNumber}`;
    }

    // Buat URL WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Buka WhatsApp
    window.open(whatsappUrl, '_blank');

    return whatsappUrl;
  };

  // Fungsi untuk menghitung usia berdasarkan tanggal lahir
  const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fungsi utama yang dipanggil saat tombol darurat ditekan
  const handleEmergencyClick = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Step 1: Dapatkan lokasi pengguna
      setPopupTitle('Mencari Lokasi');
      setPopupMessage('Sedang mendapatkan lokasi Anda...');
      setPopupVariant('info');
      setShowPopup(true);

      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });

      // Step 2: Cari rumah sakit terdekat
      setPopupMessage('Mencari rumah sakit terdekat...');
      
      const hospital = findNearestHospital(latitude, longitude);
      if (!hospital) {
        throw new Error('Tidak dapat menemukan rumah sakit terdekat');
      }
      
      setNearestHospital(hospital);

      // Step 3: Kirim pesan darurat via WhatsApp
      setPopupMessage('Menghubungi tim darurat...');
      
      const whatsappUrl = sendEmergencyMessage(hospital);

      // Step 4: Tampilkan popup sukses
      setPopupTitle('Berhasil');
      setPopupMessage(`Tim darurat dari ${hospital.name} telah dihubungi. Harap tetap tenang dan tunggu bantuan.`);
      setPopupVariant('success');

      // Panggil callback onSuccess jika disediakan
      if (onSuccess) {
        onSuccess(hospital);
      }

    } catch (error) {
      console.error('Error handling emergency:', error);
      
      // Tampilkan pesan error
      const errorMsg = error instanceof Error ? error.message : 'Terjadi kesalahan saat menghubungi tim darurat';
      setErrorMessage(errorMsg);
      setPopupTitle('Gagal');
      setPopupMessage(errorMsg);
      setPopupVariant('error');
      
      // Panggil callback onError jika disediakan
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleEmergencyClick}
        disabled={isLoading}
        className={`flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-bold transition-all ${
          isLoading ? 'opacity-75 cursor-not-allowed' : 'active:scale-95'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
            TOMBOL DARURAT
          </>
        )}
      </button>

      {/* Popup hasil */}
      {showResultPopup && (
        <Popup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          title={popupTitle}
          variant={popupVariant}
          showCloseButton={true}
        >
          <p className="mb-4">{popupMessage}</p>
          {nearestHospital && popupVariant === 'success' && (
            <div className="bg-gray-100 p-3 rounded-md mt-2 text-left">
              <h3 className="font-semibold mb-1">{nearestHospital.name}</h3>
              <p className="text-sm mb-1">{nearestHospital.address}</p>
              <p className="text-sm text-blue-600">{nearestHospital.phone}</p>
            </div>
          )}
        </Popup>
      )}
    </>
  );
};

export default TombolDarurat;