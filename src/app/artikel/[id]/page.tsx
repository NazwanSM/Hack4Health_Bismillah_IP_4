"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IoChevronBackOutline } from 'react-icons/io5';
import { FaRegBookmark, FaBookmark, FaShare } from 'react-icons/fa';
import articles from '@/data/article';
import PageTransition from '../../components/PageTransition';

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);
    const articleId = parseInt(params.id);
    
    // Find the article by ID
    const article = articles.find(a => a.id === articleId);
    
    // Format article content with paragraphs
    const formatContent = (content: string) => {
        return content.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mb-4">
            {paragraph.trim()}
        </p>
        ));
    };

    const handleBack = () => {
        router.push('/artikel');
    };

    const toggleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleShare = () => {
        if (navigator.share) {
        navigator.share({
            title: article?.title || 'Artikel Kesehatan',
            text: article?.title || 'Artikel Kesehatan',
            url: window.location.href,
        }).catch(err => {
            console.error('Sharing failed:', err);
            alert('Fitur berbagi belum tersedia pada perangkat ini.');
        });
        } else {
        alert('Fitur berbagi belum tersedia pada perangkat ini.');
        }
    };

    if (!article) {
        return (
        <div className="flex flex-col min-h-screen bg-[#fffdf5]">
            <div className="text-center">
            <p className="text-gray-600">Artikel tidak ditemukan</p>
            <button 
                className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg"
                onClick={handleBack}
            >
                Kembali ke Daftar Artikel
            </button>
            </div>
        </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fffdf5]">
        <PageTransition>
        {/* Back Button */}
        <div className="flex items-center px-4 my-2 relative mt-10">
                    <button 
                    onClick={handleBack}
                    className="cursor-pointer w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center absolute left-4 text-black"
                    >
                    <IoChevronBackOutline size={20} />
                    </button>
        </div>

        {/* Article Header */}
        <div className="px-6 mt-12">
            <h1 className="text-2xl font-bold mb-2 text-black">{article.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
            <span>{article.date}</span>
            <span className="mx-2">•</span>
            <span>{article.time}</span>
            </div>
        </div>

        {/* Article Image */}
        <div className="w-100 h-56 relative mb-6 mx-6">
            <Image 
            src={article.image} 
            alt={article.title} 
            layout="fill"
            className='w-full h-full rounded-lg'
            />
        </div>

        {/* Article Source */}
        <div className="px-6 flex items-center mb-6">
            <div className="w-8 h-8 bg-[#364C84] flex items-center justify-center rounded-md text-white font-bold mr-2">
            {article.source.charAt(0)}
            </div>
            <div>
            <p className="font-semibold text-black">{article.source}</p>
            <p className="text-sm text-gray-600">{article.author}</p>
            </div>
        </div>

        {/* Article Content */}
        <div className="px-6 mb-6 text-base leading-relaxed text-black">
            {formatContent(article.content)}
        </div>

        {/* Save and Share Buttons */}
        <div className="px-6 flex justify-between">
            <button 
            onClick={toggleSave}
            className="flex items-center space-x-2 text-gray-600 cursor-pointer"
            >
            {isSaved ? (
                <FaBookmark className="text-[#364C84]" size={18} />
            ) : (
                <FaRegBookmark size={18} />
            )}
            <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
            </button>
            <button 
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-600"
            >
            <FaShare size={18} />
            <span>Bagikan</span>
            </button>
        </div>

        {/* Article Tags */}
        <div className="px-6 mt-6">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
                <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                #{tag}
                </span>
            ))}
            </div>
        </div>

        {/* Related Articles Placeholder */}
        {/*
        <div className="px-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Artikel Terkait</h3>
            <div className="grid grid-cols-1 gap-4">
            {relatedArticles would go here}
            </div>
        </div>
        */}
        </PageTransition>
        </div>
    );
}