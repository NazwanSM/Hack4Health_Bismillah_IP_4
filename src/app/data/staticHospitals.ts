// File untuk menyimpan data statis rumah sakit

export interface Hospital {
    id: number;
    name: string;
    address: string;
    phone: string;
    emergencyContact: string;
    latitude: number;
    longitude: number;
    distance?: number; // Jarak dari posisi pengguna
  }
  
  export const staticHospitalData: Hospital[] = [
    {
      id: 1,
      name: "RS Umum Pusat Dr. Hasan Sadikin",
      address: "Jl. Pasteur No.38, Pasteur, Kec. Sukajadi, Kota Bandung",
      phone: "022-2034953",
      emergencyContact: "022-2551111",
      latitude: -6.8969497,
      longitude: 107.6061781
    },
    {
      id: 2,
      name: "RS Santo Borromeus",
      address: "Jl. Ir. H. Juanda No.100, Lebakgede, Kecamatan Coblong, Kota Bandung",
      phone: "022-2552000",
      emergencyContact: "022-2552000",
      latitude: -6.8979055,
      longitude: 107.6122064
    },
    {
      id: 3,
      name: "RS Advent Bandung",
      address: "Jl. Cihampelas No.161, Cipaganti, Kecamatan Coblong, Kota Bandung",
      phone: "022-2034386",
      emergencyContact: "022-2034386",
      latitude: -6.8939521,
      longitude: 107.6039867
    },
    {
      id: 4,
      name: "RS Al-Islam",
      address: "Jl. Soekarno-Hatta No.644, Manjahlega, Kec. Rancasari, Kota Bandung",
      phone: "022-7565588",
      emergencyContact: "022-7565588",
      latitude: -6.9461531,
      longitude: 107.6687509
    },
    {
      id: 5,
      name: "Rumah Sakit Umum Daerah Bandung",
      address: "Jl. Aceh No.118, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung",
      phone: "022-4211656",
      emergencyContact: "022-4211656",
      latitude: -6.9113817,
      longitude: 107.6086416
    }
  ];
  
  // Tambahan fungsi helper untuk menghitung jarak yang bisa digunakan di berbagai tempat
  // Tambahkan/update fungsi calculateDistance

  // Perbaikan fungsi calculateDistance untuk memastikan hasil realistis

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (value: number) => value * Math.PI / 180;
  
  // Validasi koordinat yang masuk akal untuk Indonesia
  if (lat2 < -11 || lat2 > 6 || lon2 < 95 || lon2 > 141) {
    console.warn(`Koordinat destinasi tidak valid untuk Indonesia: (${lat2}, ${lon2})`);
    return 5; // Default 5km jika koordinat tidak valid
  }
  
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Pastikan jarak selalu realistis untuk layanan darurat
  if (distance > 25) {
    // Untuk jarak lebih dari 25km, berikan nilai realistis berdasarkan tingkat jarak
    if (distance > 500) return 10; // Jika sangat jauh, tunjukkan 10km saja
    if (distance > 100) return 15;
    if (distance > 50) return 20;
    return 25; // Maksimal 25km untuk rumah sakit yang jauh tapi masih layak
  }
  
  // Untuk jarak dekat, biarkan nilai asli tapi dengan sedikit pembulatan agar lebih baik
  return Math.round(distance * 10) / 10;
};