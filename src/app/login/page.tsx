"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import { loginUser, getUserData } from '../utils/authService';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            if (!email || !password) {
                setError('Email dan kata sandi harus diisi');
                setIsLoading(false);
                return;
            }

            // Login with Firebase
            const userCredential = await loginUser(email, password);
            const user = userCredential.user;
            
            // Get additional user data from Firestore
            const userData = await getUserData(user.uid);
            
            if (userData) {
                // Format user data
                const formattedUserData = {
                    id: user.uid,
                    name: userData.name || 'Pengguna',
                    email: userData.email || email,
                    phone: userData.phone || '',
                    emergencyContact: userData.emergencyContact || '',
                    birthdate: userData.birthdate || '',
                    gender: userData.gender || '',
                    NIK: userData.NIK || '',
                    nationality: userData.nationality || '',
                    isMedicalStaff: userData.isMedicalStaff || false
                };
                
                // Use the login function from AuthProvider to set authentication state
                login('firebase-managed-token', formattedUserData);
                
                localStorage.setItem('authToken', 'firebase-managed-token');
                localStorage.setItem('userData', JSON.stringify(formattedUserData));
                
                // Redirect to homepage setelah delay singkat
                setTimeout(() => {
                    router.push('/');
                }, 100);
            } else {
                // This shouldn't happen normally, but just in case
                setError('Data pengguna tidak ditemukan');
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Login error:', err);
            
            // Handle specific Firebase auth errors
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Email atau kata sandi salah');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Terlalu banyak percobaan gagal. Coba lagi nanti atau reset kata sandi Anda');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Kredensial tidak valid. Periksa email dan kata sandi Anda');
            } else {
                setError('Terjadi kesalahan saat login. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen bg-[#ebf1fe] flex flex-col">
            <div className="h-12 flex justify-between items-center px-4 py-2">
                <div className="flex items-center space-x-2">
                </div>
            </div>

            {/* Back Button */}
            <div className="px-6 mt-2">
                <button 
                    className="w-11 h-11 flex items-center justify-center rounded-lg shadow-md bg-[#fffdf5]"
                    onClick={() => router.back()}
                >
                    <Image 
                        src="/icon/navigate_before.svg" 
                        alt="Back" 
                        width={32} 
                        height={31}
                        className="bg-[#fffdf5]" 
                    />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col px-6 py-8 mt-4 space-y-9">
                {/* Title */}
                <h1 className="text-[#364c84] text-4xl font-bold tracking-tight leading-10">
                    Selamat Datang <br />kembali!
                </h1>

                {/* Error message display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="flex flex-col space-y-3">
                    {/* Email Input */}
                    <div className="flex items-center px-4 py-2 border border-[#939698] rounded-xl">
                        <Image 
                            src="/icon/email.svg" 
                            alt="Email" 
                            width={16} 
                            height={16} 
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="ml-3 flex-1 bg-transparent outline-none text-base text-[#939698] font-['Open_Sans',_sans-serif]"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex items-center px-4 py-2 border border-[#939698] rounded-xl">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <Image 
                                src="/icon/pass.svg" 
                                alt="Password" 
                                width={16} 
                                height={16}
                                className="max-w-full max-h-full" 
                            />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Kata Sandi"
                            className="ml-3 flex-1 bg-transparent outline-none text-base text-[#939698] font-['Open_Sans',_sans-serif]"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link 
                            href="/lupa-password"
                            className="text-[#364c84] text-xs font-bold"
                        >
                            Lupa Kata Sandi?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#364c84] text-white py-3 rounded-xl text-xl font-bold disabled:bg-gray-400"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                {/* Alternative Login Options */}
                <div className="flex flex-col items-center space-y-4 mt-1">
                    <div className="relative w-full flex items-center justify-center">
                        <div className="border-t border-gray-300 w-[90px] absolute left-0"></div>
                        <span className="text-[#939698] text-xs px-4 bg-[#ebf1fe]">atau masuk dengan</span>
                        <div className="border-t border-gray-300 w-[90px] absolute right-0"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex space-x-4 justify-center">
                        <button 
                            className="w-[75px] h-[52px] border border-[#e2e2e2] rounded-lg flex items-center justify-center shadow-md bg-[#fffdf5]"
                            onClick={() => alert('Google login belum tersedia')}
                            disabled={isLoading}
                        >
                            <Image 
                                src="/icon/google.svg" 
                                alt="Google" 
                                width={22} 
                                height={22} 
                            />
                        </button>
                        <button 
                            className="w-[75px] h-[52px] border border-[#e2e2e2] rounded-lg flex items-center justify-center shadow-md bg-[#fffdf5]"
                            onClick={() => alert('Facebook login belum tersedia')}
                            disabled={isLoading}
                        >
                            <Image 
                                src="/icon/facebook.svg" 
                                alt="Facebook" 
                                width={22} 
                                height={22} 
                            />
                        </button>
                        <button 
                            className="w-[75px] h-[52px] border border-[#e2e2e2] rounded-lg flex items-center justify-center shadow-md bg-[#fffdf5]"
                            onClick={() => alert('Apple login belum tersedia')}
                            disabled={isLoading}
                        >
                            <Image 
                                src="/icon/apple.svg" 
                                alt="Apple" 
                                width={20} 
                                height={20} 
                            />
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <span className="text-[#3f5178] text-xs">Belum punya akun? </span>
                        <Link href="/register" className="text-[#364c84] text-xs font-bold">
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;