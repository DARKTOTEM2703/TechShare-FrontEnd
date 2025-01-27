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
    </div>
  );
}
