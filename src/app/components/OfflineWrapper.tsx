// src/app/components/OfflineWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const Offline = dynamic(() => import('./Offline'), {
    ssr: false,
});

export default function OfflineWrapper() {
    return <Offline />;
}