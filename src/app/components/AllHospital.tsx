"use client";

import Image from "next/image";
import { FaSearch, FaRegClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoLocationOutline, IoChevronBackOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Navbar from "./Navbar";

const AllHospitals = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/layanan');
    };

    const handleHospitalClick = (id) => {
        router.push(`/detail/${id}`);
    };

    // Extended hospital data with more locations
    const hospitals = [
        {
            id: 1,
            name: "Santo Borromeus Hospital",
            address: "Jl. Ir. H. Juanda No.100, Lebakgede, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132",
            phone: "022-2552000",
            website: "rsborromeus.com",
            hours: "24 Jam",
            image: "/hospital1.jpg",
            emergency: true,
            location: "Kecamatan Coblong",
        },
        {
            id: 2,
            name: "Rumah Sakit Santo Yusup",
            address: "Jl. Cikutra No.7, Cikutra, Kec. Cibeunying Kidul, Kota Bandung, Jawa Barat 40124",
            phone: "022-7208172",
            website: "santoyusup.com",
            hours: "24 Jam",
            image: "/hospital3.jpg", 
            emergency: true,
            location: "Kec. Cibeunying Kidul",
        },
        {
            id: 3,
            name: "Klinik Utama Bumi Medika Ganesa ITB",
            address: "Jl. Gelap Nyawang No.2, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung",
            phone: "022-2504983",
            website: "itb.ac.id/klinik",
            hours: "12.00-8.00 pm",
            image: "/hospital2.jpg",
            emergency: false,
            location: "Kecamatan Coblong",
        },
        {
            id: 4,
            name: "Rumah Sakit Santo Yusup",
            address: "Jl. Cikutra No.7, Cikutra, Kec. Cibeunying Kidul, Kota Bandung, Jawa Barat 40124",
            phone: "022-7208172",
            website: "santoyusup.com",
            hours: "24 Jam",
            image: "/hospital3.jpg",
            emergency: true,
            location: "Kec. Cibeunying Kidul",
        },
        {
            id: 5,
            name: "Rumah Sakit Santo Yusup",
            address: "Jl. Cikutra No.7, Cikutra, Kec. Cibeunying Kidul, Kota Bandung, Jawa Barat 40124",
            phone: "022-7208172",
            website: "santoyusup.com",
            hours: "24 Jam",
            image: "/hospital3.jpg",
            emergency: true,
            location: "Kec. Cibeunying Kidul",
        }
    ];

    // Group hospitals by location
    const groupedHospitals = hospitals.reduce((acc, hospital) => {
        if (!acc[hospital.location]) {
            acc[hospital.location] = [];
        }
        acc[hospital.location].push(hospital);
        return acc;
    }, {});

    return (
        <div className="p-4 bg-white min-h-screen">
            {/* Header with back button */}
            <div className="flex items-center justify-center relative mb-4">
                <button 
                    className="absolute left-0 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
                    onClick={handleBackClick}
                >
                    <IoChevronBackOutline size={20} />
                </button>
                <h1 className="text-xl font-bold">Rumah Sakit</h1>
            </div>
            
            {/* Location */}
            <div className="mb-2">
                <p className="text-sm text-gray-500">Lokasi</p>
                <div className="flex items-center">
                    <IoLocationOutline className="text-blue-900 mr-1" />
                    <p className="font-semibold text-lg text-black">Bandung, INA</p>
                    <MdOutlineKeyboardArrowDown className="ml-1 text-gray-500" />
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center bg-gray-100 rounded-full p-3 mb-4">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Temukan Rumah Sakit"
                    className="bg-transparent outline-none flex-1 text-gray-600"
                />
            </div>

            {/* Hospital list grouped by location */}
            {Object.entries(groupedHospitals).map(([location, hospitalList]) => (
                <div key={location}>
                    {/* Uncomment if you want to display location headers
                    <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2">{location}</h2>
                    */}
                    
                    {hospitalList.map((hospital) => (
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
                                        <div className="text-blue-800 mr-1">
                                            <span className="text-blue-800 font-bold text-sm">+</span>
                                        </div>
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
                </div>
            ))}

            <Navbar />
        </div>
    );
};

export default AllHospitals;