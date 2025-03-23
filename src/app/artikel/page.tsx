"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaSearch, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { IoBook, IoNotifications } from 'react-icons/io5';
import articles from '@/data/article';
import NavBar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

export default function ArticlePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [savedArticles, setSavedArticles] = useState<number[]>([]);

    const handleArticleClick = (id: number) => {
        router.push(`/artikel/${id}`);
    };

    const toggleSaveArticle = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Prevent navigating to article page when clicking bookmark
        
        setSavedArticles(prev => {
        if (prev.includes(id)) {
            return prev.filter(articleId => articleId !== id);
        } else {
            return [...prev, id];
        }
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#fffdf5]">
        <PageTransition>
        {/* Header */}
        <div className="px-4 mb-4 mt-10">
            <h1 className="text-2xl font-bold text-center text-black">Artikel</h1>
        </div>

        {/* Subheading and Notification Button */}
        <div className="flex justify-between items-center px-6 mb-4">
            <h2 className="text-lg font-semibold text-black">Temukan wawasan baru!</h2>
            <button className="w-10 h-10 rounded-full bg-[#E7F1A8] flex items-center justify-center">
                <img src="/icon/bookmarks.svg" alt="bookmark" />
            </button>
        </div>

        {/* Search Bar */}
        <div className="mx-6 mb-6">
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Pencarian"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-[#939698]"
                value={searchQuery}
                onChange={handleSearch}
            />
            </div>
        </div>

        {/* Articles List */}
        <div className="px-6">
            {filteredArticles.map((article) => (
            <div 
                key={article.id}
                className="mb-6 border border-[#E7F1A8] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleArticleClick(article.id)}
            >
                <div className="relative w-full h-40">
                <Image
                    src={article.image || "/icon/placeholder.jpg"}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                />
                </div>
                <div className="p-4">
                <h3 className="text-lg font-bold mb-1 text-black">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{article.date}</p>
                <div className="flex justify-end">
                    <button 
                    className="p-1"
                    onClick={(e) => toggleSaveArticle(e, article.id)}
                    >
                    {savedArticles.includes(article.id) ? (
                        <FaBookmark className="text-blue-800" size={18} />
                    ) : (
                        <FaRegBookmark className="text-gray-500" size={18} />
                    )}
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>
        </PageTransition>
        <NavBar />
        </div>
    );
}