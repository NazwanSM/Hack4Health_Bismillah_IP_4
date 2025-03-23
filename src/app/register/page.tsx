"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { registerUser } from '../utils/authService';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Hapus state yang tidak digunakan lagi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      setIsLoading(false);
      return;
    }

    if (!name || !email || !phone || !emergencyContact || !password) {
      setError('Semua field bertanda * harus diisi');
      setIsLoading(false);
      return;
    }

    try {
      // Register user using Firebase - dengan data yang lebih sederhana
      const userData = {
        name,
        phone,
        emergencyContact,
        // Hapus field yang akan diisi di halaman question
      };

      const userCredential = await registerUser(email, password, userData);
      
      // Store user temporarily for survey
      const tempUserData = {
        id: userCredential.user.uid,
        name,
        email,
        phone,
        emergencyContact,
        // Field yang akan diisi di question akan kosong
        birthdate: '',
        gender: '',
        NIK: '',
        nationality: ''
      };
      
      localStorage.setItem('tempUser', JSON.stringify(tempUserData));
      
      // Redirect to survey
      router.push('/question');
    } catch (err: unknown) {
      // Handle specific Firebase errors
      if (err instanceof Error && 'code' in err && err.code === 'auth/email-already-in-use') {
        setError('Email sudah digunakan. Silakan gunakan email lain.');
      } else if (err instanceof Error && 'code' in err && err.code === 'auth/weak-password') {
        setError('Password terlalu lemah. Gunakan minimal 6 karakter.');
      } else {
        setError('Terjadi kesalahan saat mendaftar: ' + (err instanceof Error ? err.message : 'Unknown error'));
        console.error('Error during registration:', err);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#ebf1fe] flex flex-col overflow-auto pb-10">
      {/* Status Bar */}
      <div className="h-12 flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-2"></div>
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
      <div className="flex flex-col px-6 py-6 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-[#364c84] text-4xl font-bold tracking-tight leading-tight">
            Buat Akun <br />Baru
          </h1>
          <p className="text-gray-600 mt-2">Lengkapi data diri Anda</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          {/* Nama Lengkap */}
          <div className="flex items-center px-4 py-2 border border-[#939698] rounded-xl">
            <div className="w-4 h-4 flex items-center justify-center">
              <Image 
                src="/icon/user.svg" 
                alt="User" 
                width={16} 
                height={16}
                className="max-w-full max-h-full" 
              />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Lengkap *"
              className="ml-3 flex-1 bg-transparent outline-none text-base text-[#939698] font-['Open_Sans',_sans-serif]"
              disabled={isLoading}
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center px-4 py-2 border border-[#939698] rounded-xl">
            <div className="w-4 h-4 flex items-center justify-center">
              <Image 
                src="/icon/phone.svg" 
                alt="Phone" 
                width={16} 
                height={16}
                className="max-w-full max-h-full" 
              />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nomor Telepon *"
              className="ml-3 flex-1 bg-transparent outline-none text-base text-[#939698] font-['Open_Sans',_sans-serif]"
              disabled={isLoading}
              required
            />
          </div>

          {/* Emergency Contact */}
          <div className="flex items-center px-4 py-2 border border-[#939698] rounded-xl">
            <div className="w-4 h-4 flex items-center justify-center">
              <Image 
                src="/icon/emergency.svg" 
                alt="Emergency" 
                width={16} 
                height={16}
                className="max-w-full max-h-full" 
              />
            </div>
            <input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Kontak Darurat *"
              className="ml-3 flex-1 bg-transparent outline-none text-base text-[#939698] font-['Open_Sans',_sans-serif]"
              disabled={isLoading}
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center px-4 py-2 border border-[#939698] rounded-xl">
            <div className="w-4 h-4 flex items-center justify-center">
              <Image 
                src="/icon/email.svg" 
                alt="Email" 
                width={16} 
                height={16}
                className="max-w-full max-h-full" 
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email *"
              className="ml-3 flex-1 bg-transparent outline-none text-base text-[#939698] font-['Open_Sans',_sans-serif]"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password */}
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
              placeholder="Kata Sandi *"
              className="ml-3 flex-1 bg-transparent outline-none text-base text-[#939698] font-['Open_Sans',_sans-serif]"
              disabled={isLoading}
              minLength={6}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center px-4 py-2 border border-[#939698] rounded-xl">
            <div className="w-4 h-4 flex items-center justify-center">
              <Image 
                src="/icon/pass.svg" 
                alt="Confirm Password" 
                width={16} 
                height={16}
                className="max-w-full max-h-full" 
              />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi Kata Sandi *"
              className="ml-3 flex-1 bg-transparent outline-none text-base text-[#939698] font-['Open_Sans',_sans-serif]"
              disabled={isLoading}
              required
            />
          </div>

          <p className="text-xs text-gray-600">* Wajib diisi</p>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#364c84] text-white py-3 rounded-xl text-xl font-bold mt-4 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <span className="text-[#3f5178] text-sm">Sudah punya akun? </span>
          <Link href="/login" className="text-[#364c84] text-sm font-bold">
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}