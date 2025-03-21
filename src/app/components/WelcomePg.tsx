"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from './AuthProvider';

export const WelcomeScreen: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { setFirstTimeViewed } = useAuth();
    const totalSlides = 3;

    const handleNext = () => {
        // Mark first-time user as viewed
        setFirstTimeViewed();
    };

    return (
        <div className="w-full h-screen bg-[#F5F5F5] flex flex-col">
        {/* Status Bar Placeholder */}
        <div className="h-12 flex justify-between items-center px-4 py-2">
            <div className="text-sm font-semibold">9:41</div>
            <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-black opacity-50"></div>
            <div className="w-4 h-2 bg-black opacity-50"></div>
            <div className="w-6 h-3 bg-black opacity-50 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white">32%</span>
            </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-6">
            <div className="text-center">
            <h1 className="text-3xl font-bold text-[#4B56D2] mb-4">
                Selamat Datang di MediMerge!
            </h1>
            <p className="text-base text-gray-700 px-4">
                Kesehatan Anda adalah prioritas kami. Dapatkan layanan medis cepat, aman, dan terpercaya dalam satu aplikasi.
            </p>
            </div>

            {/* Medical Device Illustration */}
            <div className="flex justify-center my-8">
            <Image 
                src="/medical-device.png" 
                alt="Medical Device" 
                width={220} 
                height={280} 
                className="object-contain"
            />
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 mb-8">
            {[...Array(totalSlides)].map((_, index) => (
                <div 
                key={index}
                className={`h-2 rounded-md ${
                    index === currentSlide ? 'w-7 bg-[#4B56D2]' : 'w-2 bg-[#E0E0E0]'
                }`}
                />
            ))}
            </div>

            {/* Next Button */}
            <button 
            className="w-full bg-[#4B56D2] text-white py-3 rounded-xl text-xl font-bold"
            onClick={handleNext}
            >
            Selanjutnya
            </button>
        </div>
        </div>
    );
};

export default WelcomeScreen;