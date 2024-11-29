'use client'; // Marca este archivo como un Client Component

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Usa usePathname y useRouter de next/navigation
import SideNav from "@/components/SideNav/SideNav"; // Asegúrate de que la ruta sea correcta

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false); // Estado para manejar la carga
    const pathname = usePathname(); // Obtén la ruta actual

    useEffect(() => {
        // Cuando cambia la ruta, podemos marcar el estado de carga
        setLoading(true);

        // Para simular un retraso (en un caso real, esto es opcional)
        const timer = setTimeout(() => {
            setLoading(false); // Detenemos el estado de carga después de un breve retraso
        }, 500); // 500ms de retraso

        return () => {
            clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
        };
    }, [pathname]); // Ejecutamos el useEffect cada vez que el pathname cambia

    return (
        <div className="horizontal-flex">
            <div className="side-nav">
                <SideNav /> {/* Aquí se renderiza el SideNav fijo */}
            </div>
            <div className="content">
                {loading ? (
                    <div className="loading-spinner">Loading...</div> // Aquí puedes poner un spinner o cualquier indicador visual
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
