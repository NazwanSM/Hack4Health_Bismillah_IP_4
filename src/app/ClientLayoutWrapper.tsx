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

    useEffect(() => {
        // Delay to ensure client-side rendering
        const timer = setTimeout(() => {
            // Check user status when component loads
            const firstTimeStatus = checkFirstTimeUser();
            const loginStatus = checkUserLoggedIn();

            setAuthStatus({
                isFirstTime: firstTimeStatus,
                isLoggedIn: loginStatus
            });
            setIsClientReady(true);

            // Handle routing based on auth status
            if (pathname === '/') {
                if (firstTimeStatus) {
                    // First time user, redirect to welcome page
                    router.replace('/welcome');
                } else if (!loginStatus) {
                    // Returning user but not logged in, redirect to login
                    router.replace('/login');
                }
                // If logged in, stay on home page
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname, router]);

    // Determine if the current path is a public route that doesn't require auth
    const isPublicRoute = ['/welcome', '/login', '/daftar', '/lupa-password'].includes(pathname);

    // Don't show any content until client-side code has run
    if (!isClientReady) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
                <div className="text-center">Memuat...</div>
            </div>
        );
    }

    // Allow access to public routes
    // For protected routes, check if user is logged in
    if (!isPublicRoute && !authStatus.isLoggedIn) {
        // If we're on client-side, redirect
        if (typeof window !== 'undefined') {
            router.replace('/login');
        }
        
        // Show loading while redirecting
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
                <div className="text-center">Mengalihkan ke halaman login...</div>
            </div>
        );
    }

    return (
        <AuthProvider>
            <div className="max-w-md mx-auto bg-[#FFFDF5] min-h-screen relative">
                {children}
                {!isPublicRoute && <OfflineWrapper />}
            </div>
        </AuthProvider>
    );
}