"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function FirstVisitHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("Current path:", pathname);
    console.log("Has visited before:", localStorage.getItem('hasVisitedBefore'));

    const nonProtectedRoutes = ['/welcome', '/login', '/signup', '/register', '/forgot-password'];
    if (nonProtectedRoutes.includes(pathname)) {
      console.log("On non-protected route, skipping checks");
      setIsChecking(false);
      return;
    }

    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore') === 'true';
    console.log("Has visited before (exact check):", hasVisitedBefore);
    
    if (pathname === '/' || !nonProtectedRoutes.includes(pathname)) {
      if (!hasVisitedBefore) {
        console.log("First visit detected, redirecting to welcome");
        localStorage.setItem('hasVisitedBefore', 'true');
        router.push('/welcome');
        return; 
      } else if (!user) {
        const hasRedirectedToLogin = sessionStorage.getItem('hasRedirectedToLogin') === 'true';
        if (!hasRedirectedToLogin) {
          console.log("Not logged in, redirecting to login");
          sessionStorage.setItem('hasRedirectedToLogin', 'true');
          router.push('/login');
          return;
        }
      }
    }
    
    setIsChecking(false);
  }, [pathname, router, user]);

  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
}