"use client"
import NavBar from '@/components/NavBar/NavBar';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const redirected = useRef(false);
  
  useEffect(() => {
    if (!redirected.current) {
      redirected.current = true;
      router.push('/home');
    }
  }, [router]);

  return (
    <div>
    </div>
  );
}
