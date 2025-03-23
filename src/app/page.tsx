// src/app/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';
import hospitals from '../data/hospitals';
import { useAuth } from './components/AuthProvider';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import PageTransition from './components/PageTransition';

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;
  const id = "1";
  const hospital = hospitals.find((h) => h.id === parseInt(id));
  const { user } = useAuth();

  // Auto-rotate banner slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat pagi";
    if (hour < 18) return "Selamat siang";
    return "Selamat malam";
  };

  const handleHospitalClick = (id) => {
    router.push(`/detail/${id}`);
  };

  const handleSeeAllClick = () => {
    router.push('/all-hospitals');
  };

  return (
    <div className="max-w-md mx-auto bg-[#fffdf5] min-h-screen pb-20">
      <PageTransition>
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div>
          <p className="text-neutral-400 text-sm">{getGreeting()}!</p>
          <h2 className="font-bold text-black">{user?.name || 'Pengguna'}</h2>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image 
            src="/icon/avatar.png" 
            alt="User profile"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </header>

      {/* Banner */}
      <div className="relative bg-[#E7F1A8] p-4 mx-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="max-w-[60%]">
            <h2 className="text-2xl font-bold mb-2 text-neutral-950 ">Darurat? Kami Siap Membantu!</h2>
            <p className="text-sm text-neutral-950 ">
              Jangan panik! Gunakan tombol darurat untuk mendapatkan pertolongan cepat.
            </p>
          </div>
          <div className="w-[120px] h-[120px] relative  rotate-5">
            <Image
              src="/icon/Ambulance.svg"
              alt="Ambulance"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalSlides)].map((_, index) => (
            <div 
              key={index}
              className={`h-2 rounded-full ${
                index === currentSlide ? 'w-6 bg-gray-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="mt-6 px-4">
        <h3 className="text-xl font-bold mb-4 text-black">Kategori</h3>
        <div className="grid grid-cols-3 gap-2">
          <Link href="/riwayat-penyakit" className="flex flex-col items-center">
            <div className="bg-[#E7F1A8] w-16 h-16 rounded-lg flex items-center justify-center mb-2">
              <div className="w-14 h-14 relative">
                <Image
                  src="/icon/memo.svg"
                  alt="Riwayat Penyakit"
                  layout="fill"
                  className='w-14 h-14 left-0 top-0 absolute'
                />
                <Image
                  src="/icon/RedCross.svg"
                  alt="Riwayat Penyakitt"
                  width={6}
                  height={6}
                  className='w-3.5 h-3.5 left-[35.20px] top-[7.50px] absolute'
                />
              </div>
            </div>
            <span className="text-center text-xs font-semibold text-neutral-950">Riwayat Penyakit</span>
          </Link>
          
          <Link href="/pengingat-obat" className="flex flex-col items-center">
            <div className="bg-[#E7F1A8] w-16 h-16 rounded-lg flex items-center justify-center mb-2">
              <div className="w-14 h-14 relative">
                <Image
                  src="/icon/Reminder.svg"
                  alt="Pengingat Obat"
                  width={50}
                  height={12}
                  className="left-0 top-0 absolute"
                />
                <Image
                  src="/icon/Medecine.svg"
                  alt="Pengingat Obat"
                  width={14}
                  height={14}
                  className='w-10 h-10 left-[21.43px] top-[21.43px] absolute'
                />
              </div>
            </div>
            <span className="text-center text-xs font-semibold text-neutral-950">Pengingat Obat</span>
          </Link>
          
          <Link href="/koleksi" className="flex flex-col items-center">
            <div className="bg-[#E7F1A8] w-16 h-16 rounded-lg flex items-center justify-center mb-2">
              <div className="relative">
                <Image
                  src="/icon/Koleksi_Saya.svg"
                  alt="Koleksi Saya"
                  width={38}
                  height={12}
                />
              </div>
            </div>
            <span className="text-center text-xs font-semibold text-neutral-950">Koleksi Saya</span>
          </Link>
        </div>
      </section>

      {/* Nearby Hospitals */}
      <section className="mt-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-950">Rumah Sakit Terdekat</h3>
          <div 
            className="flex items-center text-gray-800 cursor-pointer"
            onClick={handleSeeAllClick}
            >
          <span className="mr-1">Semua</span>
          <MdOutlineKeyboardArrowRight />
          </div>
        </div>

        <div className="bg-[#fffdf5] rounded-lg shadow p-2 border border-gray-100 cursor-pointer flex"
        onClick={() => handleHospitalClick(hospital?.id)}>
          <div className="flex gap-3">
            <div className="w-20 h-24 rounded-md overflow-hidden">
              <Image
                src="/icon/boromeus.png"
                alt="Santo Borromeush Hospital"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="text-[#364c84] text-xs font-medium px-0 rounded">
                  Emergency Department
                </div>
              </div>
              <h4 className="font-bold mt-1 text-neutral-950">{hospital?.name}</h4>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <span className="w-3 h-3 rounded-full mr-1">⏱</span>
                <span>{hospital?.hours}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {hospital?.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="mt-6 px-4 mb-20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-neutral-950 font-bold">Artikel Terbaru</h3>
          <Link href="/artikel" className="text-sm font-medium">
            Semua &gt;
          </Link>
        </div>

        <div className="bg-[#fffdf5] rounded-lg shadow p-2 border border-gray-100">
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-md overflow-hidden">
              <Image
                src="/article.jpg"
                alt="Medical Article"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-neutral-950">Cara Mengatasi Kecemasan di Tempat Kerja</h4>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                Tips dan trik mengatasi kecemasan saat bekerja agar produktivitas tetap terjaga
              </p>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <span>22 November 2024</span>
                <span className="mx-2">•</span>
                <span>5 menit baca</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Bar */}
    </PageTransition>
    <Navbar />
    </div>
  );
}