"use client";

import Image from "next/image";
import { FaSearch, FaRegClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import hospitals from "../../data/hospitals";
import Navbar from "../components/Navbar";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from "react-icons/md";

const Layanan = () => {
    const router = useRouter();

    const handleHospitalClick = (id) => {
        router.push(`/detail/${id}`);
    };

    const handleSeeAllClick = () => {
        router.push('/all-hospitals');
    };

    // Added third hospital for the updated UI
    const extendedHospitals = [
        ...hospitals,
        {
            id: 3,
            name: "Rumah Sakit Santo Yusup",
            address: "Jl. Cikutra No.7, Cikutra, Kec. Cibeunying Kidul, Kota Bandung, Jawa Barat 40124",
            phone: "022-7208172",
            website: "santoyusup.com",
            hours: "24 Jam",
            image: "/hospital3.jpg",
            emergency: true,
            location: {
                lat: -6.9011,
                lng: 107.6321,
            },
        },
        // Duplicate of the second hospital to match the UI mockup
        {
            id: 4,
            name: "Klinik Utama Bumi Medika Ganesa ITB",
            address: "Jl. Gelap Nyawang No.2, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung",
            phone: "022-2504983",
            website: "itb.ac.id/klinik",
            hours: "12.00-8.00 pm",
            image: "/hospital2.jpg",
            emergency: false,
            location: {
                lat: -6.8911,
                lng: 107.6092,
            },
        }
    ];

    return (
        <div className="p-4 bg-white min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <div className="flex items-center">
                        <IoLocationOutline className="text-blue-900 mr-1" />
                        <p className="font-semibold text-lg text-black">Bandung, INA</p>
                        <MdOutlineKeyboardArrowDown className="ml-1 text-gray-500" />
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                    <Image src="/profile.jpg" alt="Profile Picture" width={40} height={40} />
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center bg-gray-100 rounded-full p-3 mb-6">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Temukan Rumah Sakit"
                    className="bg-transparent outline-none flex-1 text-gray-600"
                />
            </div>

            {/* Rumah Sakit Terdekat Section */}
            <h2 className="text-2xl font-bold mb-3 text-black">Rumah Sakit Terdekat</h2>
            
            {extendedHospitals.slice(0, 2).map((hospital) => (
                <div
                    key={hospital.id}
                    className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-4 cursor-pointer flex"
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
                                <div className="w-4 h-4 text-blue-800 mr-1">+</div>
                                <p className="text-blue-800 text-sm font-medium">Emergency Department</p>
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

            {/* Rumah Sakit Section with See All */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-black">Rumah Sakit</h2>
                <div 
                    className="flex items-center text-gray-800 cursor-pointer"
                    onClick={handleSeeAllClick}
                >
                    <span className="mr-1">Semua</span>
                    <MdOutlineKeyboardArrowRight />
                </div>
            </div>
            
            {extendedHospitals.slice(2, 4).map((hospital) => (
                <div
                    key={hospital.id}
                    className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-4 cursor-pointer flex"
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
                                <div className="w-4 h-4 text-blue-800 mr-1">+</div>
                                <p className="text-blue-800 text-sm font-medium">Emergency Department</p>
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
            
            {/* Navigation Bar */}
            <Navbar />
        </div>
    );
};

export default Layanan;