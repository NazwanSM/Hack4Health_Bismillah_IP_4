'use client';

import { useEffect, useState } from 'react';

const Offline: React.FC = () => {
    const [isOffline, setIsOffline] = useState<boolean>(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div
        style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            padding: '1rem',
            backgroundColor: '#f44336',
            color: 'white',
            textAlign: 'center',
            zIndex: 9999,
        }}
        >
        Anda sedang dalam mode offline. Beberapa fitur mungkin tidak tersedia.
        </div>
    );
};

export default Offline;