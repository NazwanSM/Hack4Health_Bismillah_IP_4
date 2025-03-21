// src/app/components/Navbar.tsx
"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import EmergencyIcon from '@/public/icons/notifications_active.svg'

export default function Navbar() {
const pathname = usePathname();

return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-zinc-200">
        
        <div className="flex justify-between items-end px-6 pb-2">
            {/* Home */}
            <Link href="/" className="flex flex-col items-center gap-1 w-12">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={pathname === '/layanan' ? 'currentColor' : '#6B7280'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className={`text-xs font-semibold ${pathname === '/' ? 'text-black' : 'text-gray-500'}`}>
                Beranda
            </span>
            </Link>

            {/* Article */}
            <Link href="/artikel" className="flex flex-col items-center gap-1 w-14">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={pathname === '/artikel' ? 'currentColor' : '#6B7280'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <span className={`text-xs font-semibold ${pathname === '/artikel' ? 'text-black' : 'text-gray-500'}`}>
                Artikel
            </span>
            </Link>

            {/* Emergency */}
            <Link href="/darurat" className="flex flex-col items-center relative w-14">
            <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center mb-1">
                <div className="relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-8.618l3.098-3.098a2.233 2.233 0 0 1 3.156 0l.205.206a.5.5 0 0 1-.013.7l-2.14 2.14a1 1 0 0 0 1.415 1.415l2.14-2.14a.5.5 0 0 1 .7-.014l.205.206a2.233 2.233 0 0 1 0 3.156l-3.098 3.098z" />
                    <path d="M16.379 10.826a6.082 6.082 0 0 1-8.618 8.618l-3.098-3.098a2.233 2.233 0 0 1 0-3.156l.205-.205a.5.5 0 0 1 .7.013l2.14 2.14a1 1 0 0 0 1.415-1.414l-2.14-2.14a.5.5 0 0 1-.014-.7l.206-.206a2.233 2.233 0 0 1 3.156 0l3.098 3.098z" />
                </svg>
                <span className="absolute top-[9px] left-[8px] text-[4px] font-semibold text-indigo-900">SOS</span>
                </div>
            </div>
            <span className="text-xs font-semibold text-indigo-900">
                Darurat
            </span>
            </Link>

            {/* Services */}
            <Link href="/layanan" className="flex flex-col items-center gap-1 w-14">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={pathname === '/layanan' ? 'currentColor' : '#6B7280'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className={`text-xs font-semibold ${pathname === '/layanan' ? 'text-black' : 'text-gray-500'}`}>
                Layanan
            </span>
            </Link>

            {/* Profile */}
            <Link href="/profil" className="flex flex-col items-center gap-1 w-14">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={pathname === '/profil' ? 'currentColor' : '#6B7280'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            <span className={`text-xs font-semibold ${pathname === '/profil' ? 'text-black' : 'text-gray-500'}`}>
                Profil
            </span>
            </Link>
        </div>
        </div>
    );
}