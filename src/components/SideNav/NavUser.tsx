import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useRoleCheck } from '@/providers/RoleCheckProvider';
import { cleanRoleName } from '@/utils/roleFormatter';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function NavUser({ hamburgerButton }: { hamburgerButton: () => void }) {
    const { userData } = useRoleCheck();
    const { isDark, toggleDarkMode } = useDarkMode();
    const [userName, setUserName] = useState('User Name');
    const [userRole, setUserRole] = useState('Role');

    useEffect(() => {
        if (userData && userData.firstName && userData.lastName) {
            setUserName(`${userData.firstName} ${userData.lastName}`);
            if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
                setUserRole(cleanRoleName(userData.roles[0]));
            }
        }
    }, [userData]);

    return (
        <div>
            <div className="flex h-auto min-h-[60px] text-secondary grow items-center justify-between gap-2 rounded-md p-3 text-sm font-medium md:p-2 md:px-3">
                {/* Icono de usuario */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FaUserCircle size={36} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-primary text-sm md:text-base truncate">{userName}</h2>
                        <p className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 truncate">{userRole}</p>
                    </div>
                </div>

                {/* Contenedor de botones (tema + hamburger) */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Botón de tema - siempre visible */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
                        title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        {isDark ? (
                            <FaSun className="w-4 h-4" />
                        ) : (
                            <FaMoon className="w-4 h-4" />
                        )}
                    </button>

                    {/* Botón hamburger - solo en móvil */}
                    <button 
                        onClick={hamburgerButton} 
                        className="md:hidden p-2"
                        aria-label="Abrir menú de navegación"
                        title="Abrir menú"
                    >
                        <svg
                            className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}