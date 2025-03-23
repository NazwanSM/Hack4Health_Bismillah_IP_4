// src/app/components/Navbar.tsx
"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import PageTransition from './PageTransition';

export default function Navbar() {
const pathname = usePathname();

return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#fffdf5] border-t border-zinc-200">
        
        <div className="flex justify-between items-end px-6 pb-2">
            {/* Home */}
            <Link href="/" className="flex flex-col items-center gap-1 w-12">
            <img 
                src={pathname === '/' ? "/icon/home.svg" : "/icon/not-home.svg"}
                alt="home" 
            />
            <span className={`text-xs font-semibold ${pathname === '/' ? 'text-black' : 'text-gray-500'}`}>
                Beranda
            </span>
            </Link>

            {/* Article */}
            <Link href="/artikel" className="flex flex-col items-center gap-1 w-14">
            <img 
                src={pathname === '/artikel' ? "/icon/article.svg" : "/icon/not-article.svg"}
                alt="home" 
            />
            <span className={`text-xs font-semibold ${pathname === '/artikel' ? 'text-black' : 'text-gray-500'}`}>
                Artikel
            </span>
            </Link>

            {/* Emergency */}
            <Link href="/darurat" className="flex flex-col items-center relative w-14">
            <div className="w-12 h-12 bg-[#364C84] rounded-full flex items-center justify-center mb-1">
                <div className="relative">
                <img 
                    src="/icon/notifications_active.svg" 
                    alt="darurat" />
                <span className="absolute top-[11px] left-[9.7px] text-[4px] font-bold text-[#364C84]">SOS</span>
                </div>
            </div>
            <span className="text-xs font-semibold text-[#364C84]">
                Darurat
            </span>
            </Link>

            {/* Services */}
            <Link href="/layanan" className="flex flex-col items-center gap-1 w-14">
            <img 
                src={pathname === '/layanan' ? "/icon/layanan.svg" : "/icon/not-layanan.svg"}
                alt="home" 
            />
            <span className={`text-xs font-semibold ${pathname === '/layanan' ? 'text-black' : 'text-gray-500'}`}>
                Layanan
            </span>
            </Link>

            {/* Profile */}
            <Link href="/profil" className="flex flex-col items-center gap-1 w-14">
            <img 
                src={pathname === '/profil' ? "/icon/profile.svg" : "/icon/not-profile.svg"}
                alt="home" 
            />
            <span className={`text-xs font-semibold ${pathname === '/profil' ? 'text-black' : 'text-gray-500'}`}>
                Profil
            </span>
            </Link>
        </div>
        </div>
    );
}