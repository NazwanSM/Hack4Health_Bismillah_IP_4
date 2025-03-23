"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { IoChevronBackOutline } from 'react-icons/io5';
import { FiEdit2 } from 'react-icons/fi';
import { updateUserProfile } from '../utils/authService';
import PageTransition from '../components/PageTransition';

export default function EditProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        name: '',
        gender: '',
        birthdate: '',
        isMedicalStaff: false,
        nationality: '',
        NIK: '',
        phone: '',
        emergencyContact: '',
        email: ''
    });
    
    // Format birthdate from ISO to display format (e.g., "9 Juni 1994")
    const formatBirthdate = (isoDate: string): string => {
        if (!isoDate) return '';
        
        const date = new Date(isoDate);
        const day = date.getDate();
        
        // Indonesian month names
        const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    };

    // Initialize profile data from user context
    useEffect(() => {
        if (user) {
        setProfileData({
            name: user.name || 'Lia Heryana',
            gender: user.gender || 'Wanita',
            birthdate: user.birthdate ? formatBirthdate(user.birthdate) : '9 Juni 1994',
            isMedicalStaff: user.isMedicalStaff || false,
            nationality: user.nationality || 'Warga Negara Indonesia',
            NIK: user.NIK || '3019 9429 4305 1254',
            phone: user.phone || '+62 8235687125',
            emergencyContact: user.emergencyContact || '+62 87564322039',
            email: user.email || 'leehyeri@gmail.com'
        });
        }
    }, [user]);

    const handleBack = () => {
        router.push('/profil');
    };

    const handleEditField = (field: string) => {
        // In a real app, this would open a modal or navigate to a form to edit this specific field
        console.log(`Editing field: ${field}`);
        // For demo purposes, we'll just alert
        alert(`Editing ${field} - This would open an edit form in a complete implementation`);
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

    return (
        <div className="flex flex-col min-h-screen bg-[#fffdf5]">
        <PageTransition>
        {/* Header with back button */}
        <div className="flex items-center px-4 my-2 relative mt-10">
            <button 
            onClick={handleBack}
            className="cursor-pointer w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center absolute left-4 text-black"
            >
            <IoChevronBackOutline size={20} />
            </button>
            <h1 className="text-xl font-bold text-center w-full text-black">Edit Profil</h1>
        </div>

        {/* Profile Picture Section */}
        <div className="flex justify-center mt-6 relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-300">
            <Image 
                src="/icon/avatar.png" 
                alt="Profile Picture" 
                width={96} 
                height={96}
                className="w-full h-full object-cover"
            />
            </div>
            <button 
            className="absolute bottom-0 right-1/2 mr-[-50px] bg-gray-200 p-2 rounded-full text-[#636A6D] shadow-md"
            onClick={() => handleEditField('profilePicture')}
            >
            <FiEdit2 size={16} />
            </button>
        </div>

        {/* Profile Information */}
        <div className="px-6 mt-8 space-y-6">
            {/* Nama Lengkap */}
            <div>
            <p className="text-gray-500">Nama Lengkap</p>
            <p className="text-[#364C84] text-lg font-semibold">{profileData.name}</p>
            </div>

            {/* Jenis Kelamin */}
            <div>
            <p className="text-gray-500">Jenis Kelamin</p>
            <p className="text-[#364C84] text-lg font-semibold">{profileData.gender}</p>
            </div>

            {/* Tanggal Lahir */}
            <div>
            <p className="text-gray-500">Tanggal Lahir</p>
            <p className="text-[#364C84] text-lg font-semibold">{profileData.birthdate}</p>
            </div>

            {/* Status */}
            <div>
            <p className="text-gray-500">Status</p>
            <p className="text-[#364C84] text-lg font-semibold">
                {profileData.isMedicalStaff ? 'Tenaga Medis' : 'Bukan Tenaga Medis'}
            </p>
            </div>

            {/* Kewarganegaraan */}
            <div>
            <p className="text-gray-500">Kewarganegaraan</p>
            <p className="text-[#364C84] text-lg font-semibold">{profileData.nationality}</p>
            </div>

            {/* Nomor Induk Kependudukan */}
            <div>
            <p className="text-gray-500">Nomor Induk Kependudukan</p>
            <p className="text-[#364C84] text-lg font-semibold">{profileData.NIK}</p>
            </div>

            {/* Nomor Telepon */}
            <div>
            <p className="text-gray-500">Nomor Telepon</p>
            <p className="text-[#364C84] text-lg font-semibold">{profileData.phone}</p>
            </div>

            {/* Nomor Darurat */}
            <div>
            <p className="text-gray-500">Nomor Darurat</p>
            <p className="text-[#364C84] text-lg font-semibold">{profileData.emergencyContact}</p>
            </div>

            {/* Email */}
            <div>
            <p className="text-gray-500">Email</p>
            <p className="text-[#364C84] text-lg font-semibold">{profileData.email}</p>
            </div>
        </div>

        {/* Bottom placeholder for spacing */}
        <div className="h-16"></div>
        </PageTransition>
        </div>
    );
}