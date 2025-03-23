"use client";

import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { BsHospital } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigation } from "react-icons/md";
import { useRouter } from "next/navigation";
import hospitals from "../../data/hospitals";
import PageTransition from "./PageTransition";

const DetailRumahSakit = ({ id }) => {
    const router = useRouter();
    
    // Find the hospital by id from the data
    const hospital = hospitals.find((h) => h.id === parseInt(id));
    
    if (!hospital) {
        return <div>Hospital not found</div>;
    }

    // Generate Google Maps URL with coordinates
    const mapUrl = `https://maps.google.com/maps?q=${hospital.location.lat},${hospital.location.lng}&z=15&output=embed`;
    
    return (
        <div className="flex flex-col min-h-screen bg-[#fffdf5]">
        
        {/* Header with back button and hospital name */}
        <div className="bg-[#364c84] p-4 pb-6 text-[#fffdf5] relative rounded-b-3xl max-h-[200px]">
            <div className="mb-6">
            <button 
                onClick={() => router.back()} 
                className="p-3 rounded-lg bg-indigo-50 inline-flex items-center justify-center cursor-pointer"
                aria-label="Go back"
            >
                <IoIosArrowBack className="text-neutral-950 text-xl" />
            </button>
            </div>
            
            <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold leading-tight max-w-[70%]">{hospital.name}</h1>
            <div className="bg-indigo-50 px-1 mt-1 rounded-full flex items-center">
                <span className="mr-1">⌚</span>
                <span className="text-sm text-[#364c84]">{hospital.hours}</span>
            </div>
            </div>
        </div>
        <PageTransition>
        {/* Map Section with curved top edges to overlap header */}
        <div className="relative mt-5 mx-4 rounded-xl overflow-hidden shadow-lg">
            <div className="w-full h-56 relative">
            <iframe 
                src={mapUrl} 
                className="w-full h-full border-0" 
                allowFullScreen=""
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div className="absolute bottom-4 right-4">
                <button className="bg-[#364c84] shadow-md rounded-lg px-4 py-2 flex items-center text-[#fffdf5]">
                <MdOutlineNavigation className="mr-2 text-[#fffdf5]" />
                Arah
                </button>
            </div>
            </div>
        </div>
        
        {/* Hospital details */}
        <div className="p-4 flex-1 bg-[#fffdf5]">
            {/* Address */}
            <div className="flex py-4 border-b border-gray-200">
            <div className="text-[#364c84] mr-4 flex-shrink-0">
                <IoLocationOutline size={24} />
            </div>
            <p className="text-[#364c84] font-medium">
                {hospital.address}
            </p>
            </div>
            
            {/* Emergency Department */}
            {hospital.emergency && (
            <div className="flex py-4 border-b border-gray-200">
                <div className="text-[#364c84] mr-4 flex-shrink-0">
                <BsHospital size={24} />
                </div>
                <p className="text-[#364c84] font-medium">
                Emergency department
                </p>
            </div>
            )}
            
            {/* Phone */}
            <div className="flex py-4 border-b border-gray-200">
            <div className="text-[#364c84] mr-4 flex-shrink-0">
                <FiPhone size={24} />
            </div>
            <p className="text-[#364c84] font-medium">
                {hospital.phone}
            </p>
            </div>
            
            {/* Website */}
            <div className="flex py-4 border-b border-gray-200">
            <div className="text-[#364c84] mr-4 flex-shrink-0">
                <HiOutlineGlobeAlt size={24} />
            </div>
            <p className="text-[#364c84] font-medium">
                {hospital.website}
            </p>
            </div>
        </div>
        </PageTransition>
        </div>
    );
};

export default DetailRumahSakit;