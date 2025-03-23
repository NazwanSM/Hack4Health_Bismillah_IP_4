"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { IoCreateOutline } from 'react-icons/io5';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { AiOutlineFileText } from 'react-icons/ai';
import Navbar from '../components/Navbar';

interface UserData {
    name: string;
    birthdate?: string;
    email: string;
}

export default function ProfilePage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [age, setAge] = useState<string>('');

    useEffect(() => {
        // Calculate age if birthdate exists
        if (user?.birthdate) {
        const birthDate = new Date(user.birthdate);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        
        // Adjust age if birthday hasn't occurred yet this year
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            years--;
        }
        
        setAge(`${years} Tahun`);
        } else {
        setAge('30 Tahun'); // Default age if not provided
        }
    }, [user]);

    const handleEditProfile = () => {
        router.push('/edit-profile');
    };

    const handleMedicalHistory = () => {
        router.push('/medical-history');
    };

    const handleSettings = () => {
        router.push('/settings');
    };

    const handleLogout = async () => {
        try {
        await logout();
        router.push('/login');
        } catch (error) {
        console.error('Error logging out:', error);
        }
    };

    const navigateTo = (path: string) => {
        router.push(path);
    };

    if (isLoading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center">
            <p className="text-gray-600">Loading...</p>
            </div>
        </div>
        );
    }

    // For demo purposes, if no user is found, we'll still display the page with placeholder data
    const userName = user?.name || "Lia Heryana";

    return (
        <div className="flex flex-col min-h-screen bg-[#fffdf5]">

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-20">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
            <Image 
                src="/icon/avatar.png" 
                alt="Profile Picture" 
                width={96} 
                height={96}
                className="w-full h-full object-cover"
            />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-[#0a0a0b] ">{userName}</h1>
            <p className="text-gray-500 mt-1">{age}</p>
        </div>
        
        {/* Menu Card */}
        <div className="mx-6 mt-8 bg-white rounded-3xl shadow-md p-6">
            {/* Personal Data Section */}
            <h2 className="text-xl font-bold mb-4 text-[#0a0a0b]">Data Pribadi</h2>
            
            <button 
            onClick={handleEditProfile}
            className="flex items-center w-full py-4 border-b border-gray-200 cursor-pointer"
            >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ">
                <IoCreateOutline size={20} className="text-gray-700" />
            </div>
            <span className="ml-4 text-lg text-[#0a0a0b]">Edit Profil</span>
            </button>
            
            <button 
            onClick={handleMedicalHistory}
            className="flex items-center w-full py-4"
            >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <AiOutlineFileText size={20} className="text-gray-700" />
            </div>
            <span className="ml-4 text-lg text-[#0a0a0b]">Riwayat Penyakit</span>
            </button>
            
            {/* Other Section */}
            <h2 className="text-xl font-bold mt-6 mb-4 text-[#0a0a0b]">Lainnya</h2>
            
            <button 
            onClick={handleSettings}
            className="flex items-center w-full py-4 border-b border-gray-200"
            >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <FiSettings size={20} className="text-gray-700" />
            </div>
            <span className="ml-4 text-lg text-[#0a0a0b]">Pengaturan</span>
            </button>
            
            <button 
            onClick={handleLogout}
            className="flex items-center w-full py-4 text-red-500"
            >
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <FiLogOut size={20} className="text-red-500" />
            </div>
            <span className="ml-4 text-lg">Keluar</span>
            </button>
        </div>
        
        {/* Navigation Bar */}
        <Navbar />
        </div>
    );
}