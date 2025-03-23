"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkFirstTimeUser, checkUserLoggedIn } from './utils/authUtils';
import OfflineWrapper from './components/OfflineWrapper';
import { AuthProvider } from './components/AuthProvider';

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
    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    // Handle initial state check
    useEffect(() => {
        const timer = setTimeout(() => {
            const firstTimeStatus = checkFirstTimeUser();
            const loginStatus = checkUserLoggedIn();

            setAuthStatus({
                isFirstTime: firstTimeStatus,
                isLoggedIn: loginStatus
            });
            setIsClientReady(true);

            // Set redirect path if needed
            if (pathname === '/') {
                if (firstTimeStatus) {
                    setRedirectPath('/welcome');
                } else if (!loginStatus) {
                    setRedirectPath('/login');
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Handle redirect separately
    useEffect(() => {
        if (redirectPath) {
            router.replace(redirectPath);
            setRedirectPath(null);
        }
    }, [redirectPath, router]);

    // Determine public routes
    const isPublicRoute = ['/welcome', '/login', '/register', '/lupa-password'].includes(pathname);

    // Loading state
    if (!isClientReady) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
                <div className="text-center">Memuat...</div>
            </div>
        );
    }

    // Auth protection for non-public routes
    if (!isPublicRoute && !authStatus.isLoggedIn) {
        // Set redirect and return loading
        if (typeof window !== 'undefined' && !redirectPath) {
            setRedirectPath('/login');
        }
        
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
                <div className="text-center">Mengalihkan ke halaman login...</div>
            </div>
        );
    }

    return (
        <AuthProvider>
            <div className={`max-w-md mx-auto bg-[#FFFDF5] min-h-screen relative ${fonts}`}>
                {children}
                {!isPublicRoute && <OfflineWrapper />}
            </div>
        </AuthProvider>
    );
}