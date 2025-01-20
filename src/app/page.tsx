"use client"
import NavBar from '@/components/NavBar/NavBar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleButtonClick = () => {
    router.push('/admin/roles');
  };
  useEffect(() => {
    router.push('/home'); 
  }, [router]);

  return (
    <div>
      {/*
      <button
        onClick={handleButtonClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        
        Go to Admin Page
      </button>
      */}
    </div>
  );
}
