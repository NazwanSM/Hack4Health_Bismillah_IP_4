"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import {updateUserProfile } from '../utils/authService';

// Define the survey questions
const surveyQuestions = [
  {
    id: 1,
    question: "Tanggal Lahir Anda",
    type: "date", // Date input type
    fieldName: "birthdate" // Field in user database
  },
  {
    id: 2,
    question: "Masukkan Nomor Induk Kependudukan Anda",
    type: "nik", // Custom NIK input
    fieldName: "NIK", // Field in user database
    validation: (value: string) => {
      return /^\d{16}$/.test(value) ? null : "NIK harus berisi 16 digit angka";
    }
  },
  {
    id: 3,
    question: "Apa jenis kelamin Anda?",
    type: "radio", // Radio button selection
    options: ["Pria", "Wanita"],
    fieldName: "gender" // Field in user database
  },
  {
    id: 4,
    question: "Pilih kewarganegaraan Anda",
    type: "radio", // Radio button selection
    options: ["Warga Negara Indonesia", "Warga Negara Asing"],
    fieldName: "nationality" // Field in user database
  },
  {
    id: 5,
    question: "Apakah Anda seorang tenaga medis?",
    type: "radio", // Radio button selection
    options: ["Ya", "Tidak"],
    fieldName: "isMedicalStaff" // Field in user database
  }
];

export default function OnboardingSurvey() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [dateValue, setDateValue] = useState('');
  const [nikValue, setNikValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  
  interface UserData {
    id: string;
    name: string;
    email: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // for other properties
  }

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get the temporary user data from localStorage
    const tempUser = localStorage.getItem('tempUser');
    if (tempUser) {
      setUserData(JSON.parse(tempUser));
    } else {
      // If no temporary user data, redirect to register page
      router.push('/register');
    }
  }, [router]);

  const setRadioAnswer = (answer: string) => {
    const fieldName = surveyQuestions[currentQuestion].fieldName;
    setAnswers({
      ...answers,
      [fieldName]: answer
    });
  };

  const handleNext = () => {
    const currentQuestionData = surveyQuestions[currentQuestion];
    
    if (currentQuestionData.type === "date") {
      // Save date value to answers
      if (!dateValue) {
        setValidationError("Silakan pilih tanggal lahir Anda");
        return;
      }
      setAnswers({...answers, [currentQuestionData.fieldName]: dateValue});
      setValidationError(null);
    }
    else if (currentQuestionData.type === "nik") {
      // Validate NIK
      const error = currentQuestionData.validation ? currentQuestionData.validation(nikValue) : null;
      if (error) {
        setValidationError(error);
        return;
      }
      setAnswers({...answers, [currentQuestionData.fieldName]: nikValue});
      setValidationError(null);
    }
    else if (currentQuestionData.type === "radio") {
      // Check if radio option has been selected
      if (!answers[currentQuestionData.fieldName]) {
        setValidationError("Silakan pilih salah satu opsi");
        return;
      }
      setValidationError(null);
    }

    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete the survey and process registration
      completeRegistration();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setValidationError(null);
    }
  };

  const completeRegistration = async () => {
    setIsLoading(true);
  
    try {
      if (userData) {
        // Format data for database update
        const userProfileData = {
          birthdate: answers.birthdate || '',
          NIK: answers.NIK || '',
          gender: answers.gender === 'Pria' ? 'male' : 'female',
          nationality: answers.nationality === 'Warga Negara Indonesia' ? 'Indonesia' : 'Foreign',
          isMedicalStaff: answers.isMedicalStaff === 'Ya' ? true : false
        };
        
        // Update user profile in Firestore
        await updateUserProfile(userData.id, userProfileData);
        
        // Hapus data sementara
        localStorage.removeItem('tempUser');
        
        // Tampilkan pesan sukses dan redirect ke login
        alert("Registrasi berhasil! Silakan login dengan akun Anda.");
        
        // Navigasi ke halaman login menggunakan window.location
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      } else {
        console.error('No user data available');
        router.push('/register');
      }
    } catch (error) {
      console.error("Error completing registration:", error);
      alert("Terjadi kesalahan saat menyimpan jawaban Anda. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const progressPercent = ((currentQuestion + 1) / surveyQuestions.length) * 100;

  // Render current question based on its type
  const renderQuestion = () => {
    const currentQuestionData = surveyQuestions[currentQuestion];

    if (currentQuestionData.type === "date") {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#364c84] mb-4">
            {currentQuestionData.question}
          </h2>
          <div className="border border-[#939698] rounded-xl p-4">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full bg-transparent outline-none text-base text-[#364c84]"
              max={new Date().toISOString().split('T')[0]} // Set max date to today
            />
          </div>
        </div>
      );
    }
    
    if (currentQuestionData.type === "nik") {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#364c84] mb-4">
            {currentQuestionData.question}
          </h2>
          <div className="border border-[#939698] rounded-xl p-4">
            <input
              type="text"
              value={nikValue}
              onChange={(e) => {
                // Allow only numbers and max length of 16
                const value = e.target.value.replace(/[^\d]/g, '').slice(0, 16);
                setNikValue(value);
              }}
              placeholder="Masukkan 16 digit NIK"
              className="w-full bg-transparent outline-none text-base text-[#364c84]"
              maxLength={16}
            />
          </div>
          <p className="text-xs text-gray-500">
            NIK terdiri dari 16 digit angka yang tertera pada KTP Anda
          </p>
        </div>
      );
    }

    if (currentQuestionData.type === "radio") {
      return (
        <div>
          <h2 className="text-2xl font-bold text-[#364c84] mb-8">
            {currentQuestionData.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestionData.options?.map((option, index) => (
              <button
                key={index}
                className={`w-full flex items-center px-4 py-3 border rounded-xl transition-all duration-200 cursor-pointer ${
                  answers[currentQuestionData.fieldName] === option
                    ? 'border-[#364c84] bg-[#364c84]/10 text-[#364c84]'
                    : 'border-[#939698] text-[#939698]'
                }`}
                onClick={() => setRadioAnswer(option)}
                disabled={isLoading}
              >
                <div className={`w-5 h-5 flex items-center justify-center border rounded-full mr-3 ${
                  answers[currentQuestionData.fieldName] === option
                    ? 'border-[#364c84]'
                    : 'border-[#939698]'
                }`}>
                  {answers[currentQuestionData.fieldName] === option && (
                    <div className="w-3 h-3 bg-[#364c84] rounded-full"></div>
                  )}
                </div>
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full h-screen bg-[#ebf1fe] flex flex-col overflow-auto">
      {/* Status Bar */}
      <div className="h-12 flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-2"></div>
      </div>

      {/* Progress Bar */}
      <div className="w-full px-6">
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-[#364c84] rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Pertanyaan {currentQuestion + 1}/{surveyQuestions.length}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 py-6 space-y-6">
        {/* Question */}
        <div>
          {renderQuestion()}
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm">
            {validationError}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-auto">
          <button
            className={`px-4 py-2 rounded-xl cursor-pointer ${
              currentQuestion > 0 
                ? 'text-[#364c84] border border-[#364c84]' 
                : 'text-gray-400 border border-gray-300'
            }`}
            onClick={handlePrev}
            disabled={currentQuestion === 0 || isLoading}
          >
            Sebelumnya
          </button>
          
          <button
            className="px-6 py-2 bg-[#364c84] text-white rounded-xl disabled:bg-gray-400 cursor-pointer"
            onClick={handleNext}
            disabled={isLoading}
          >
            {currentQuestion === surveyQuestions.length - 1 
              ? (isLoading ? 'Memproses...' : 'Selesai') 
              : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}