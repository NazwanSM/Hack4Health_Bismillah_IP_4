"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WelcomeScreen } from './components/WelcomePg';
import { checkFirstTimeUser, checkUserLoggedIn } from './utils/authUtils';
import OfflineWrapper from './components/OfflineWrapper';

export default function ClientLayoutWrapper({ 
    children,
    fonts 
    }: { 
    children: React.ReactNode,
    fonts: string 
    }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isClientReady, setIsClientReady] = useState(false);
    const [authStatus, setAuthStatus] = useState({
        isFirstTime: true,
        isLoggedIn: false
    });

    useEffect(() => {
        // Delay to ensure client-side rendering
        const timer = setTimeout(() => {
        // Cek status pengguna saat komponen dimuat
        const firstTimeStatus = checkFirstTimeUser();
        const loginStatus = checkUserLoggedIn();

        setAuthStatus({
            isFirstTime: firstTimeStatus,
            isLoggedIn: loginStatus
        });
        setIsClientReady(true);

        // Redirect logic
        if (!loginStatus) {
            if (firstTimeStatus) {
            // Jika pertama kali, arahkan ke welcome screen
            router.replace('/welcome');
            } else if (!['/login', '/daftar', '/welcome'].includes(pathname)) {
            // Jika tidak login dan bukan di halaman login/signup, arahkan ke login
            router.replace('/login');
            }
        }
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Render the same content on server and client to prevent hydration mismatch
    return (
        <html lang="id">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={fonts}>
            {!isClientReady ? (
            <div>Memuat...</div>
            ) : !authStatus.isLoggedIn ? (
            pathname === '/welcome' ? (
                <WelcomeScreen />
            ) : (
                children // Render login atau signup page
            )
            ) : (
            <div className="max-w-md mx-auto bg-[#FFFDF5] min-h-screen relative">
                {children}
                <OfflineWrapper />
            </div>
            )}
        </body>
        </html>
    );
}