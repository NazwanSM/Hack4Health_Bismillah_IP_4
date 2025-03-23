// src/app/components/Navbar.tsx
"use client";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import EmergencyIcon from '@/public/icons/notifications_active.svg'
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import axios from 'axios'; 
import { Hospital, staticHospitalData, calculateDistance } from '../data/staticHospitals';
import PageTransition from './PageTransition';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  
  // State untuk mengelola popup darurat
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [processingEmergency, setProcessingEmergency] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [apiCallSuccessful, setApiCallSuccessful] = useState(false);
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);


  // Fungsi untuk mendapatkan lokasi pengguna
  const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.error('Geolokasi tidak didukung oleh browser ini');
        reject(new Error('Geolokasi tidak didukung oleh browser Anda'));
        return;
      }

      // Tambahkan timeout dan error handling yang lebih baik
      const locationTimeout = setTimeout(() => {
        console.error('Timeout mendapatkan lokasi');
        reject(new Error('Waktu mendapatkan lokasi habis. Coba lagi atau izinkan akses lokasi di pengaturan browser.'));
      }, 15000); // 15 detik

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          console.log('Berhasil mendapatkan lokasi:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          resolve(position);
        },
        (error) => {
          clearTimeout(locationTimeout);
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Akses lokasi ditolak. Harap izinkan akses lokasi di pengaturan browser Anda.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informasi lokasi tidak tersedia. Pastikan GPS aktif atau coba di area dengan sinyal lebih baik.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Waktu mendapatkan lokasi habis. Coba lagi atau pastikan GPS aktif.';
              break;
            default:
              errorMessage = 'Terjadi kesalahan saat mendapatkan lokasi.';
          }
          console.error('Geolocation error:', errorMessage, error);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  // Fungsi untuk mendapatkan data rumah sakit dari API
  // Ganti hanya fungsi fetchHospitalsFromAPI dengan kode berikut:

const fetchHospitalsFromAPI = async (latitude: number, longitude: number): Promise<Hospital[]> => {
  try {
    setStatusMessage('Terhubung ke API rumah sakit...');
    console.log('Memanggil API hospitals dengan parameter:', { latitude, longitude });
    
    // Gunakan API Route internal untuk mengatasi masalah CORS
    const apiUrl = `/api/hospitals?latitude=${latitude}&longitude=${longitude}`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`Gagal mengambil data rumah sakit: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Raw Response:', data);
    
    if (!data || !data.results || !Array.isArray(data.results)) {
      console.error('Format API response tidak sesuai:', data);
      throw new Error('Format data API tidak sesuai');
    }

    if (data.results.length === 0) {
      console.warn('API mengembalikan array kosong');
      throw new Error('Tidak ditemukan rumah sakit di sekitar lokasi Anda');
    }

    // Validasi hasil untuk memastikan tidak ada data internasional yang lolos
    const indonesianKeywords = ['rumah sakit', 'rs ', 'rsu ', 'rsud ', 'indonesia', 
      'jakarta', 'bandung', 'surabaya', 'medan', 'makassar', 'jawa', 'sumatra', 
      'kalimantan', 'sulawesi', 'papua', 'jl.', 'jalan'];
    
    const nonIndonesianKeywords = ['uk', 'united kingdom', 'england', 'london', 'manchester', 
      'britain', 'british', 'nhs', 'royal'];
    
    // Transform data API menjadi format Hospital
    const hospitals = data.results
      .filter((place: any) => {
        // Filter hasil yang jelas bukan dari Indonesia
        const address = (place.vicinity || place.formatted_address || place.address || '').toLowerCase();
        const name = (place.name || '').toLowerCase();

        
        const isNonIndonesian = nonIndonesianKeywords.some(keyword => 
          address.includes(keyword) || name.includes(keyword)
        );

    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#fffdf5] border-t border-zinc-200">

        
        if (isNonIndonesian) {
          console.warn(`Skipping non-Indonesian hospital: ${place.name} (${address})`);
          return false;
        }
        
        return true;
      })
      .map((place: any, index: number) => {
        // Log data mentah untuk debugging
        console.log(`Raw hospital data ${index}:`, {
          name: place.name,
          address: place.vicinity || place.formatted_address || place.address,
          location: place.geometry?.location || { lat: place.latitude, lng: place.longitude }
        });
        
        const hospital = {
          id: place.id || index + 1,
          name: place.name || `Rumah Sakit #${index + 1}`,
          address: place.vicinity || place.formatted_address || place.address || 'Alamat tidak tersedia',
          phone: place.formatted_phone_number || place.phone || '(Nomor tidak tersedia)',
          emergencyContact: place.emergency_contact || place.formatted_phone_number || place.phone || '(Nomor darurat tidak tersedia)',
          latitude: place.geometry?.location?.lat || place.latitude || latitude,
          longitude: place.geometry?.location?.lng || place.longitude || longitude,
          distance: place.distance || calculateDistance(latitude, longitude, 
            place.geometry?.location?.lat || place.latitude, 
            place.geometry?.location?.lng || place.longitude)
        };
        
        return hospital;
      });

    console.log('Hospitals processed from API:', hospitals.length);
    
    // Sort berdasarkan jarak
    const sortedHospitals = hospitals.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    
    // Verifikasi akhir untuk filter jarak yang tidak masuk akal
    const validatedHospitals = sortedHospitals.filter(hospital => {
      if (hospital.distance && hospital.distance > 1000) {
        console.warn(`Hospital with unreasonable distance removed: ${hospital.name} (${hospital.distance.toFixed(2)} km)`);
        return false;
      }
      return true;
    });
    
    console.log('Top 3 nearest hospitals:', 
      validatedHospitals.slice(0, 3).map(h => `${h.name} (${h.distance?.toFixed(2)} km)`));
    
    if (validatedHospitals.length === 0) {
      console.warn('Tidak ada rumah sakit valid setelah validasi');
      throw new Error('Tidak menemukan rumah sakit Indonesia terdekat');
    }
    
    return validatedHospitals;
  } catch (error) {
    console.error('Error in fetchHospitalsFromAPI:', error);
    throw error;
  }
};
  
  // Fungsi untuk mendapatkan data rumah sakit terdekat
  const getNearbyHospitals = async () => {
    try {
      setProcessingEmergency(true);
      setErrorMessage(null);
      setIsUsingLocalData(false);
      setApiCallSuccessful(false); // Reset state
      setStatusMessage('Mendapatkan lokasi Anda...');
      console.log('Memulai pencarian rumah sakit...');
      
      // Step 1: Dapatkan lokasi pengguna
      let latitude, longitude;
      try {
        const position = await getUserLocation();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        setUserLocation({ latitude, longitude });
        console.log('Lokasi ditemukan:', { latitude, longitude });
      } catch (locError) {
        console.warn('Error mendapatkan lokasi, menggunakan lokasi default:', locError);
        // Lokasi default (Bandung city center)
        latitude = -6.9175;
        longitude = 107.6191;
        setUserLocation({ latitude, longitude });
        // Optional: tampilkan pesan tapi tetap lanjutkan proses
        setErrorMessage(`Menggunakan lokasi default Bandung. Error: ${locError.message}`);
      }
      
      setStatusMessage('Mencari rumah sakit terdekat...');
      
      // Step 2: Coba ambil data dari API
      let hospitalsData: Hospital[] = [];
      try {
        console.log('Mencoba mengambil data dari API dengan koordinat:', { latitude, longitude });
        hospitalsData = await fetchHospitalsFromAPI(latitude, longitude);
        console.log('Data dari API berhasil didapat:', hospitalsData);
        setApiCallSuccessful(true);
      } catch (apiError) {
        console.warn('Gagal mengambil data dari API:', apiError);
        setStatusMessage('Menggunakan data lokal...');
        setIsUsingLocalData(true);
        
        // Gunakan data statis dan hitung jarak
        console.log('Menggunakan data statis dan menghitung jarak...');
        hospitalsData = staticHospitalData.map(hospital => {
          const distance = calculateDistance(latitude, longitude, hospital.latitude, hospital.longitude);
          console.log(`Jarak ke ${hospital.name}: ${distance.toFixed(2)} km`);
          return {
            ...hospital,
            distance
          };
        }).sort((a, b) => (a.distance || 999) - (b.distance || 999));
        console.log('Data statis dengan jarak (sorted):', hospitalsData);
      }
      
      // Pastikan hospitalsData tidak kosong
      if (!hospitalsData || hospitalsData.length === 0) {
        console.warn('PERINGATAN: Tidak ada data rumah sakit ditemukan. Menggunakan data statis tanpa jarak.');
        hospitalsData = staticHospitalData.map(hospital => ({
          ...hospital,
          distance: 999 // Nilai default jika jarak tidak dapat dihitung
        }));
        setIsUsingLocalData(true);
      }
      
      console.log('Jumlah rumah sakit yang ditemukan:', hospitalsData.length);
      
      // Step 3: Simpan rumah sakit terdekat ke state
      setNearbyHospitals(hospitalsData);
      
      // Step 4: Simpan ke localStorage untuk penggunaan di masa depan
      localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
      localStorage.setItem('nearbyHospitals', JSON.stringify(hospitalsData));
      localStorage.setItem('lastUpdated', new Date().toISOString());
      
      // Simpan data ke service worker untuk offline access
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_HOSPITALS',
          hospitals: hospitalsData,
          location: { latitude, longitude }
        });
      }
      
      // Step 5: Buka popup darurat
      setShowEmergencyPopup(true);
      setStatusMessage(null);
      
    } catch (error) {
      console.error('Error getting nearby hospitals:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat mencari rumah sakit terdekat');
      
      // Fallback ke data statis tanpa jarak jika semua proses gagal
      try {
        console.log('FALLBACK: Menggunakan data statis sebagai last resort');
        const basicStaticData = staticHospitalData;
        setNearbyHospitals(basicStaticData);
        setIsUsingLocalData(true);
      } catch (e) {
        console.error('Critical Error: Even static data failed', e);
      }
    } finally {
      setProcessingEmergency(false);
      setStatusMessage(null);
    }
  };

  // Fungsi untuk mengirim pesan darurat ke WhatsApp
  const sendEmergencyMessage = (hospital: Hospital) => {
    const userName = user?.name || 'Pengguna';
    
    // Buat pesan darurat yang sederhana
    const message = 
      `🚨 DARURAT MEDIS! 🚨\n\n` +
      `Nama: ${userName}\n` +
      (userLocation ? `📍 Lokasi: https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}\n\n` : '') +
      `⚠️ Pasien dalam kondisi DARURAT! Mohon bantuan segera!`;

    // Format nomor telepon untuk WhatsApp
    let phoneNumber = hospital.emergencyContact || hospital.phone;
    phoneNumber = phoneNumber.replace(/\D/g, ''); // Hapus semua karakter non-digit
    if (!phoneNumber.startsWith('62')) {
      phoneNumber = phoneNumber.startsWith('0') ? `62${phoneNumber.substring(1)}` : `62${phoneNumber}`;
    }

    // Buat URL WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Simpan rekaman kontak darurat
    try {
      const emergencyLogs = JSON.parse(localStorage.getItem('emergencyLogs') || '[]');
      emergencyLogs.push({
        timestamp: new Date().toISOString(),
        hospital: hospital.name,
        location: userLocation,
        success: true
      });
      localStorage.setItem('emergencyLogs', JSON.stringify(emergencyLogs));
    } catch (e) {
      console.error('Error saving emergency log:', e);
    }
    
    // Buka WhatsApp
    window.open(whatsappUrl, '_blank');
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

  // Fungsi untuk memformat waktu terakhir update
  const formatLastUpdated = (): string => {
    const lastUpdated = localStorage.getItem('lastUpdated');
    if (!lastUpdated) return 'Belum pernah diperbarui';
    
    try {
      const updateTime = new Date(lastUpdated);
      return updateTime.toLocaleString('id-ID', {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Format waktu tidak valid';
    }
  };
  
  // Load data rumah sakit terdekat dari localStorage saat komponen dimount
  useEffect(() => {
    console.log('Checking localStorage for saved hospitals data');
    const savedHospitals = localStorage.getItem('nearbyHospitals');
    const savedLocation = localStorage.getItem('userLocation');
    
    if (savedHospitals && savedLocation) {
      try {
        const parsedHospitals = JSON.parse(savedHospitals);
        const parsedLocation = JSON.parse(savedLocation);
        
        console.log('Found saved data:', {
          hospitalsCount: parsedHospitals.length,
          location: parsedLocation
        });
        
        setNearbyHospitals(parsedHospitals);
        setUserLocation(parsedLocation);
        setIsUsingLocalData(true);
        console.log('Loaded data from localStorage successfully');
      } catch (e) {
        console.error('Error parsing saved data:', e);
        // Jika parsing gagal, hapus data yang rusak
        localStorage.removeItem('nearbyHospitals');
        localStorage.removeItem('userLocation');
      }
    } else {
      console.log('No saved hospitals data found in localStorage');
    }
  }, []);

  // Handler untuk tombol darurat
  const handleEmergencyButton = (e: React.MouseEvent) => {
    e.preventDefault();
    getNearbyHospitals();
  };

  // Handler untuk panggilan nomor darurat nasional
  const handleCallEmergencyNumber = () => {
    window.location.href = 'tel:119';
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#fffdf5] border-t border-zinc-200">
        <div className="flex justify-between items-end px-6 pb-2">

          {/* Home */}
          <Link href="/" className="flex flex-col items-center gap-1 w-12">
            <img 
              src={pathname === '/' ? "/icon/home.svg" : "/icon/not-home.svg"}
              alt="home" 
            />

            <Link href="/" className="flex flex-col items-center gap-1 w-12">
            <img 
                src={pathname === '/' ? "/icon/home.svg" : "/icon/not-home.svg"}
                alt="home" 
            />

            <span className={`text-xs font-semibold ${pathname === '/' ? 'text-black' : 'text-gray-500'}`}>
              Beranda
            </span>

          </Link>

          {/* Article */}
          <Link href="/artikel" className="flex flex-col items-center gap-1 w-14">
            <img 
              src={pathname === '/article' ? "/icon/article.svg" : "/icon/not-article.svg"}
              alt="home" 
            />

            </Link>
            <Link href="/artikel" className="flex flex-col items-center gap-1 w-14">
            <img 
                src={pathname === '/artikel' ? "/icon/article.svg" : "/icon/not-article.svg"}
                alt="home" 
            />

            <span className={`text-xs font-semibold ${pathname === '/artikel' ? 'text-black' : 'text-gray-500'}`}>
              Artikel
            </span>

            {/* Emergency */}

            </Link>

            <Link href="/darurat" className="flex flex-col items-center relative w-14">
            <div className="w-12 h-12 bg-[#364C84] rounded-full flex items-center justify-center mb-1">
                <div className="relative">
                <img 
                    src="/icon/notifications_active.svg" 
                    alt="darurat" />
                <span className="absolute top-[11px] left-[9.7px] text-[4px] font-bold text-[#364C84]">SOS</span>
                </div>
            </div>
            <span className="text-xs font-semibold text-[#364C84]">
                Darurat

          {/* Emergency - Ganti dengan button */}
          <button
            onClick={handleEmergencyButton}
            className="flex flex-col items-center relative w-14 focus:outline-none"
          >
            <div className={`w-12 h-12 bg-[#364C84] rounded-full flex items-center justify-center mb-1 transition-transform ${processingEmergency ? 'animate-pulse' : 'hover:scale-105 active:scale-95'}`}>
              <div className="relative">
                <img 
                  src="/icon/notifications_active.svg" 
                  alt="darurat" />
                <span className="absolute top-[11px] left-[9.7px] text-[4px] font-bold text-[#364C84]">SOS</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#364C84]">
              Darurat

            </span>
          </button>


          {/* Services */}
          <Link href="/layanan" className="flex flex-col items-center gap-1 w-14">
            <img 
              src={pathname === '/layanan' ? "/icon/layanan.svg" : "/icon/not-layanan.svg"}
              alt="home" 
            />

            </Link>
            <Link href="/layanan" className="flex flex-col items-center gap-1 w-14">
            <img 
                src={pathname === '/layanan' ? "/icon/layanan.svg" : "/icon/not-layanan.svg"}
                alt="home" 
            />

            <span className={`text-xs font-semibold ${pathname === '/layanan' ? 'text-black' : 'text-gray-500'}`}>
              Layanan
            </span>

          </Link>
          {/* Profile */}
          <Link href="/profil" className="flex flex-col items-center gap-1 w-14">
            <img 
              src={pathname === '/profil' ? "/icon/profile.svg" : "/icon/not-profile.svg"}
              alt="home" 
            />

            </Link>
            <Link href="/profil" className="flex flex-col items-center gap-1 w-14">
            <img 
                src={pathname === '/profil' ? "/icon/profile.svg" : "/icon/not-profile.svg"}
                alt="home" 
            />

            <span className={`text-xs font-semibold ${pathname === '/profil' ? 'text-black' : 'text-gray-500'}`}>
              Profil
            </span>
          </Link>
        </div>
      </div>

      {/* Emergency Popup */}
      {showEmergencyPopup && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-brightness-75 backdrop-blur-sm z-40" 
            onClick={() => setShowEmergencyPopup(false)}
          />
          
          {/* Popup content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-xl w-[90%] max-w-sm shadow-2xl transform transition-all pointer-events-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg text-black font-bold font-['Nunito_Sans']">Layanan Darurat</h2>
                <button 
                  onClick={() => setShowEmergencyPopup(false)}
                  className="text-gray-500 hover:text-gray-700 transition-transform active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {/* Tombol panggilan darurat nasional 119 */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <h3 className="text-sm font-bold text-red-800">Panggilan Darurat Nasional</h3>
                  </div>
                  <button 
                    onClick={handleCallEmergencyNumber}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Panggil 119
                  </button>
                </div>

                {errorMessage ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
                    <p className="text-red-700 font-medium mb-2">Terjadi Kesalahan</p>
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                    <button 
                      onClick={getNearbyHospitals}
                      className="mt-3 w-full bg-red-600 text-white py-2 rounded-md text-sm font-medium"
                    >
                      Coba Lagi
                    </button>
                  </div>
                ) : statusMessage ? (
                  <div className="py-8 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-center">{statusMessage}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-base">Rumah Sakit Terdekat</h3>
                        {isUsingLocalData ? (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            Data Lokal
                          </span>
                        ) : apiCallSuccessful ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Data Live
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Pilih rumah sakit untuk mengirim permintaan bantuan darurat via WhatsApp:
                      </p>
                      
                      {nearbyHospitals.length > 0 ? (
                        <div className="space-y-3">
                          {nearbyHospitals.map((hospital) => (
                            <button
                              key={hospital.id}
                              onClick={() => sendEmergencyMessage(hospital)}
                              className="w-full bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-start hover:bg-gray-50 transition-colors text-left"
                            >
                              <h4 className="font-bold text-sm">{hospital.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{hospital.address}</p>
                              <div className="flex justify-between w-full mt-2 items-center">
                                <span className="text-xs text-blue-600">
                                  {hospital.phone}
                                </span>
                                {hospital.distance && (
                                  <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                    Jarak: {hospital.distance.toFixed(1)} km
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : processingEmergency ? (
                        <div className="py-8 flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                          <p>Mencari rumah sakit terdekat...</p>
                        </div>
                      ) : (
                        <p className="text-center py-4 text-gray-500">
                          Tidak dapat menemukan rumah sakit terdekat.
                        </p>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <p className="text-xs text-gray-500 mb-2">
                        Data diperbarui terakhir: {formatLastUpdated()}
                      </p>
                      <button 
                        onClick={getNearbyHospitals}
                        disabled={processingEmergency}
                        className={`w-full py-2 rounded-md text-sm font-medium ${
                          processingEmergency 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {processingEmergency ? 'Sedang Memperbarui...' : 'Perbarui Data Lokasi'}
                      </button>
                    </div>
                    
                    {/* Debug Panel - hanya muncul di development mode */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-md border border-gray-300">
                        <details>
                          <summary className="text-sm font-medium text-gray-700 cursor-pointer">Debug Info</summary>
                          <div className="mt-2 text-xs text-gray-600 space-y-1">
                            <p>API Success: {apiCallSuccessful ? 'Yes' : 'No'}</p>
                            <p>Using Local Data: {isUsingLocalData ? 'Yes' : 'No'}</p>
                            <p>User Location: {userLocation ? `${userLocation.latitude}, ${userLocation.longitude}` : 'Not Available'}</p>
                            <p>Hospitals Found: {nearbyHospitals.length}</p>
                            <p>Error: {errorMessage || 'None'}</p>
                            <p>Last Updated: {formatLastUpdated()}</p>
                            <button 
                              onClick={() => console.log('Debug data:', {
                                apiCallSuccessful,
                                isUsingLocalData,
                                userLocation,
                                nearbyHospitals,
                                errorMessage
                              })}
                              className="mt-1 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                            >
                              Log Debug Info
                            </button>
                          </div>
                        </details>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}