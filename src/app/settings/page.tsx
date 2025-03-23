"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { IoChevronBackOutline, IoMoon, IoDocumentText } from 'react-icons/io5';
import { IoMdHome, IoMdHelp, IoMdInformationCircle, IoMdLock } from 'react-icons/io';
import { FiLogOut, FiChevronRight, FiShield } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';

export default function SettingsPage() {
    const { logout } = useAuth();
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);
    
    const handleBack = () => {
        router.push('/profil');
    };

    const handleLogout = async () => {
        try {
        await logout();
        router.push('/login');
        } catch (error) {
        console.error('Error logging out:', error);
        }
    };
    
    const showDevelopmentMessage = () => {
        alert("Fitur ini masih dalam pengembangan");
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fffdf5]">
        <PageTransition>
        <div className="flex items-center px-4 my-2 relative mt-10">
            <button 
            onClick={handleBack}
            className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center absolute left-4 cursor-pointer text-black"
            >
            <IoChevronBackOutline size={20} />
            </button>
            <h1 className="text-xl font-bold text-center w-full text-black">Pengaturan</h1>
        </div>

        <div className="px-4 mt-8">
            <h2 className="text-lg font-bold mb-2 text-black">Umum</h2>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                <IoMoon className="text-white" size={20} />
                </div>
                <span className="ml-3 text-black">Dark Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={() => {
                    setDarkMode(!darkMode);
                    showDevelopmentMessage();
                }}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#364C84]"></div>
            </label>
            </div>
            
            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={showDevelopmentMessage}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                </div>
                <span className="ml-3 text-black">Notifikasi</span>
            </div>
            <div className="flex items-center">
                <span className="text-gray-400 mr-2">On</span>
                <FiChevronRight className="text-gray-400" size={20} />
            </div>
            </div>

            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={showDevelopmentMessage}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                <IoDocumentText className="text-white" size={20} />
                </div>
                <span className="ml-3 text-black">Persetujuan</span>
            </div>
            <FiChevronRight className="text-gray-400" size={20} />
            </div>

            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={showDevelopmentMessage}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                <IoMdLock className="text-white" size={20} />
                </div>
                <span className="ml-3 text-black">Kata Sandi</span>
            </div>
            <FiChevronRight className="text-gray-400" size={20} />
            </div>

            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={showDevelopmentMessage}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                <IoMdHome className="text-white" size={20} />
                </div>
                <span className="ml-3 text-black">Alamat Tersimpan</span>
            </div>
            <FiChevronRight className="text-gray-400" size={20} />
            </div>
 
            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={handleLogout}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 text-red-500 rounded-full flex items-center justify-center">
                <FiLogOut className="text-red-500" size={20} />
                </div>
                <span className="ml-3 text-red-500">Logout</span>
            </div>
            <FiChevronRight className="text-gray-400" size={20} />
            </div>

            <h2 className="text-lg font-bold mb-2 mt-6 text-black">Bantuan</h2>

            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={showDevelopmentMessage}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                <IoMdHelp className="text-white" size={20} />
                </div>
                <span className="ml-3 text-black">Help</span>
            </div>
            <FiChevronRight className="text-gray-400" size={20} />
            </div>

            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={showDevelopmentMessage}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                <IoMdInformationCircle className="text-white" size={20} />
                </div>
                <span className="ml-3 text-black">Tentang Kami</span>
            </div>
            <FiChevronRight className="text-gray-400" size={20} />
            </div>

            <h2 className="text-lg font-bold mb-2 mt-6 text-black">Legal</h2>

            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={showDevelopmentMessage}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                <IoMdLock className="text-white" size={20} />
                </div>
                <span className="ml-3 text-black">Privasi</span>
            </div>
            <FiChevronRight className="text-gray-400" size={20} />
            </div>

            <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer"
            onClick={showDevelopmentMessage}
            >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-[#364C84] rounded-full flex items-center justify-center">
                <FiShield className="text-white" size={20} />
                </div>
                <span className="ml-3 text-black">Keamanan</span>
            </div>
            <FiChevronRight className="text-gray-400" size={20} />
            </div>
        </div>

        <div className="h-24"></div>
        </PageTransition>
        </div>
    );
}