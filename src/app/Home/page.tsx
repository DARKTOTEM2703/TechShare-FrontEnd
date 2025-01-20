"use client";
import NavBar from '@/components/NavBar/NavBar';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/AdminCrud/SearchBar';

export default function Home() {
  const router = useRouter();
  const handleButtonClick = () => {
    router.push('/admin/roles');
  };
  return (
    <div className="min-h-screen rounded-lg bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        {/* Contenedor superior */}
        <div className="px-6 py-4 bg-primary rounded-t-lg flex justify-center">
          <div className="w-full max-w-4xl">
            <SearchBar onSearchChange={() => console.log('')} />
          </div>
        </div>
        {/* Título */}
        <h1 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold text-center py-6">
          ¡Consigue los materiales que necesitas aquí!
        </h1>
      </div>
    </div>
  );
}
