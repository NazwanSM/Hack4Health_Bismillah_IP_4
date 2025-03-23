"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export const WelcomeScreen: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { setFirstTimeViewed } = useAuth();
    const router = useRouter();
    const totalSlides = 3;

    const slides = [
        {
            title: "Selamat Datang di MediMerge!",
            description: "Kesehatan Anda adalah prioritas kami. Dapatkan layanan medis cepat, aman, dan terpercaya dalam satu aplikasi.",
            image: "./icon/Heart Rate Monitor.svg"
        },
        {
            title: "Sekali Tekan, Ambulans Datang!",
            description: "Sedang Dalam kondisi darurat? Sekali tekan tombol, dan ambulans segera menuju ke lokasi Anda.",
            image: "./icon/Ambulance.svg"
        },
        {
            title: "Pantau Perjalanan Ambulans",
            description: "Jangan khawatir! Anda bisa melacak ambulans secara real-time hingga tiba di tujuan dengan selamat.",
            image: "./icon/RedCross.svg"
        }
    ];

    const handleNext = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            // Mark first-time user as viewed and proceed to login page
            setFirstTimeViewed();
            router.push('/login');
        }
    };

    const currentSlideData = slides[currentSlide];

    return (
        <div className="w-full h-screen bg-[#F5F5F5] flex flex-col">
        {/* Status Bar Placeholder */}
        <div className="h-12 flex justify-between items-center px-4 py-2">
            <div className="flex items-center space-x-2">
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-6">
            {/* Top section with fixed height */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#4B56D2] text-left mb-4">
                    {currentSlideData.title}
                </h1>
                <p className="text-base text-gray-700 text-left ">
                    {currentSlideData.description}
                </p>
            </div>

            {/* Image container with fixed dimensions */}
            <div className="h-[240px] flex items-center justify-center">
                <div className="w-[240px] h-[240px] flex items-center justify-center">
                    <Image 
                        src={currentSlideData.image} 
                        alt="Medical Illustration" 
                        width={240}
                        height={240}
                        className="object-contain max-w-full max-h-full"
                    />
                </div>
            </div>

            {/* Bottom section with fixed position */}
            <div className="space-y-8">
                {/* Slide Indicators - Fixed position and size */}
                <div className="flex justify-center items-center space-x-3 h-2">
                    {[...Array(totalSlides)].map((_, index) => (
                        <div 
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                ? 'w-6 bg-[#4B56D2]' 
                                : 'w-2 bg-[#E0E0E0]'
                            }`}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <button 
                    className="w-full bg-[#4B56D2] text-white py-3 rounded-xl text-xl font-bold"
                    onClick={handleNext}
                >
                    {currentSlide === totalSlides - 1 ? 'Masuk / Daftar' : 'Selanjutnya'}
                </button>
            </div>
        </div>
        </div>
    );
};

export default WelcomeScreen;