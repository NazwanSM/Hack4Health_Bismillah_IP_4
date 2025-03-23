"use client";

import Image from "next/image";
import { FaSearch, FaRegClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoLocationOutline, IoChevronBackOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Navbar from "./Navbar";
import hospitalsData from "@/data/hospitals";
import { useState } from "react";
import PageTransition from "./PageTransition";

const AllHospitals = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleBackClick = () => {
        router.push('/layanan');
    };

    const handleHospitalClick = (id) => {
        router.push(`/detail/${id}`);
    };

    const filteredHospitals = searchQuery 
        ? hospitalsData.filter(hospital => 
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : hospitalsData;

    const groupedHospitals = filteredHospitals.reduce((acc, hospital) => {
        const locationKey = hospital.domisicode || 'other';
        if (!acc[locationKey]) {
            acc[locationKey] = [];
        }
        acc[locationKey].push(hospital);
        return acc;
    }, {});

    return (
        <div className="p-4 bg-[#fffdf5] min-h-screen">
            <PageTransition>
            <div className="flex items-center justify-center relative mb-4 mt-10">
                <button 
                    className="absolute left-0 w-10 h-10 rounded-lg bg-[#fffdf5] shadow-md flex items-center justify-center cursor-pointer"
                    onClick={handleBackClick}
                >
                    <IoChevronBackOutline size={20}
                    className="text-[#0a0a0a]"/>
                </button>
                <h1 className="text-xl font-bold text-[#0a0a0a]">Rumah Sakit</h1>
            </div>
            <div className="mb-2">
                <p className="text-sm text-gray-500">Lokasi</p>
                <div className="flex items-center">
                    <IoLocationOutline className="text-blue-900 mr-1" />
                    <p className="font-semibold text-lg text-black">Bandung, INA</p>
                    <MdOutlineKeyboardArrowDown className="ml-1 text-gray-500" />
                </div>
            </div>
            <div className="flex items-center bg-gray-100 rounded-full p-3 mb-4">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Temukan Rumah Sakit"
                    className="bg-transparent outline-none flex-1 text-gray-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {Object.entries(groupedHospitals).map(([location, hospitalList]) => (
                <div key={location}>
                    <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2 capitalize">
                        {location}
                    </h2>
                    
                    {hospitalList.map((hospital) => (
                        <div
                            key={hospital.id}
                            className="bg-[#fffdf5] p-2 rounded-lg shadow-sm border border-gray-100 mb-4 cursor-pointer flex"
                            onClick={() => handleHospitalClick(hospital.id)}
                        >
                            <div className="w-1/3 mr-3">
                                <Image 
                                    src={hospital.image} 
                                    alt={hospital.name} 
                                    width={200} 
                                    height={150} 
                                    className="rounded-lg w-full h-full object-cover"
                                />
                            </div>
                            <div className="w-2/3">
                                {hospital.emergency && (
                                    <div className="flex items-center">
                                        <div className="text-[#364C84] mr-1">
                                            <span className="text-[#364C84] font-bold text-sm">+</span>
                                        </div>
                                        <p className="text-[#364C84] text-sm font-medium">Emergency Department</p>
                                    </div>
                                )}
                                <h3 className="font-bold text-lg text-black">{hospital.name}</h3>
                                <div className="flex items-center mt-1 mb-1">
                                    <FaRegClock className="text-green-500 w-4 h-4 mr-1" />
                                    <p className="text-green-500 text-sm">{hospital.hours}</p>
                                </div>
                                <p className="text-gray-600 text-sm">{hospital.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            </PageTransition>
            <Navbar />
        </div>
    );
};

export default AllHospitals;